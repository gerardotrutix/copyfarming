// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";


contract CopyFarming is Ownable{

    //1. Structs
    struct Vault {
        uint256 vaultId; //vault id
        uint256 startDate; // vault start date
        VaultState state; //if true, the vault is closed
        uint256 moneyAdded; //money added to vault
        uint256 expectedAPR; //expected APR
        uint256 minimumInvestment; //minimum investment per user
        string strategy; //vault strategy description
        uint256 vaultFee; //vault fee
        Trader trader; //trader
        uint256 investors;
        uint256 moneyEarned;
        uint256 moneyClaimed;
    }

    struct Trader {
        address traderWallet; //trader wallet
        string nickname; //trader nickname
    }

    struct Investement {
        uint256 investmentId;
        address investor;
        uint256 moneyInvested;
        uint256 vaultId;
    }

    struct Investor {
        address userWallet;
        uint256 moneyInvested;
        uint256 moneyEarned;
        uint256 moneyClaimed;
        uint256 contribution; 
    }

    /*struct Reward {
        uint256 fees;
        mapping(address => bool) claimUsers;
    }

    struct UserPayment {
        uint256 moneyEarned; //money earned by the user
		uint256 moneyClaimed; //amount of money the user can claim
    }*/

    enum VaultState {
		OPEN,
		YIELD,
		CLOSE	
    }

    //2. General variables
    uint256 vaultIdCounter;
    uint256 investmentIdCounter;
    mapping(address => Trader) public traders;
    mapping(string => address) public nicknames;
    Vault[] public vaultsList;
    mapping(uint256 => Vault) public vaultsMap;
    mapping(uint256 => Investement[]) public vaultInvestements;
    mapping(address => Investement[]) public userInvestments;
    mapping(uint256 => Investor[]) public vaultInvestors;
    address public investmentTokenAddress;
	IERC20 public investmentToken;


    constructor(address initialOwner, address _investmentTokenAddress) Ownable(initialOwner){
        investmentTokenAddress = _investmentTokenAddress;
        investmentToken = IERC20(_investmentTokenAddress);
    }

    //3. Functions
    function createTrader(address traderWallet, string memory nickname) public onlyOwner {

        require(traderWallet != address(0), "Trader wallet cannot be null address");

        address queriedWallet = nicknames[nickname];

        require(queriedWallet == address(0), "Nickname is used by other trader");

        Trader memory trader = Trader(traderWallet, nickname);
        traders[traderWallet] = trader;
        nicknames[nickname] = traderWallet;
    }

     function createVault(
        uint256 startDate,
        uint256 expectedAPR,
        uint256 minimumInvestment, 
        string memory strategy, 
        uint256 vaultFee,
        address traderWallet
        )  public onlyOwner { 
        
        require(startDate != 0, "Start date cannot be null");
        require(expectedAPR > 0 && expectedAPR <= 100,  "Expected APR cannot be null");
        require(minimumInvestment > 0,    "Minimum investment cannot be 0");
        bytes memory tempEmptyStringTest = bytes(strategy);
        require(tempEmptyStringTest.length != 0, "Strategy cannot be empty");
        require(vaultFee > 0 && vaultFee <= 100, "Vault fee cannot be 0");
        Trader memory trader = traders[traderWallet];
        require(trader.traderWallet != address(0), "Cannot create vault with no registered trader");
        bytes memory tempNickname = bytes(trader.nickname);
        require(tempNickname.length != 0, "Trader nickname cannot be null");

        vaultIdCounter++;

        Vault memory vault = Vault(vaultIdCounter, startDate, VaultState.OPEN, 0, expectedAPR, minimumInvestment, strategy, vaultFee, trader, 0, 0, 0);
        vaultsMap[vaultIdCounter] = vault;
        vaultsList.push(vault);
    }

    function invest(uint256 vaultId, uint256 investmentAmount) public vaultOpened (vaultId, investmentAmount) {

        Vault storage vault = vaultsMap[vaultId];

        //Transfer money to vault's trader wallet
        investmentToken.transferFrom(msg.sender, vault.trader.traderWallet, investmentAmount);

        //Update vault map
        vault.moneyAdded += investmentAmount;

        Investor[] memory investors = vaultInvestors[vaultId];

        bool userInvestedPreviously = false;
        for (uint8 i = 0; i < investors.length; i++) {
            Investor memory investor = investors[i];

            if(investor.userWallet == msg.sender){
                investor.moneyInvested += investmentAmount;
                userInvestedPreviously = true;
                break;
            }
            
        }
    
        if(!userInvestedPreviously){
            vault.investors++;

            Investor memory newInvestor = Investor(msg.sender, investmentAmount, 0,0,0);
            vaultInvestors[vaultId].push(newInvestor);
        }

        //Update vault lists
        vaultsList[vaultId-1] = vault;

        //Create investment
        investmentIdCounter++;

        Investement memory newInvestment = Investement(investmentIdCounter, msg.sender, investmentAmount, vaultId);
   
        vaultInvestements[vaultId].push(newInvestment);
        userInvestments[msg.sender].push(newInvestment);
    }

	/**
	 *@dev Close vault to start yield generation
	 */
    function closeVault(uint256 vaultId) public onlyOwner{
        Vault memory vault = vaultsMap[vaultId];

        Investor[] memory investors = vaultInvestors[vaultId];

        for (uint8 i = 0; i < investors.length; i++) {
            Investor memory investor = investors[i];
            investor.contribution = investor.moneyInvested/vault.moneyAdded;

            delete vaultInvestors[vaultId][i];
            vaultInvestors[vaultId][i] = investor;
        }

        vault.state = VaultState.YIELD;

        vaultsMap[vaultId] = vault;
    }

    function payVaultFees(uint256 vaultId, uint256 fees) public onlyVaultTrader(vaultId) {
        require(
			investmentToken.transferFrom(msg.sender, address(this), fees),
			"Transfer failed"
		);

        Vault memory vault = vaultsMap[vaultId];
        vault.moneyEarned += fees;
        vaultsMap[vaultId] = vault;

        Investor[] memory investors = vaultInvestors[vaultId];
        for (uint8 i = 0; i < investors.length; i++) {
            Investor memory investor = investors[i];
            investor.moneyEarned += fees * investor.contribution;

            delete vaultInvestors[vaultId][i];
            vaultInvestors[vaultId][i] = investor;
        }
    }

    function claimFeesInVault(uint256 vaultId) public returns(bool) {
        Vault memory vault = vaultsMap[vaultId];
        Investor[] memory investors = vaultInvestors[vaultId];
        for (uint8 i = 0; i < investors.length; i++) {
            Investor memory investor = investors[i];
            if(investor.userWallet == msg.sender){
                uint256 moneyUnclaimed = investor.moneyEarned - investor.moneyClaimed;
                if(moneyUnclaimed > 0){
                    require(
                    investmentToken.transfer(investor.userWallet, moneyUnclaimed),
                    "Transfer failed"
                    );  
                    investor.moneyClaimed += moneyUnclaimed;
                    vault.moneyClaimed += moneyUnclaimed;

                    delete vaultInvestors[vaultId][i];
                    vaultInvestors[vaultId][i] = investor;

                    vaultsMap[vaultId] = vault;
                }
                return true;
            }

        }

        return false;
    }


    function getUserInvestmentInfoInVault(address user, uint256 vaultId) public view returns (Investor memory){
        Investor memory investor = Investor(address(0),0, 0, 0, 0);
        
        Investor[] memory investors = vaultInvestors[vaultId];
        for (uint8 i = 0; i < investors.length; i++) {
            Investor memory tempInvestor = investors[i];
            if(tempInvestor.userWallet == user){
                investor = tempInvestor;
                break;
            }
        }

        return investor;
    }

    function getAllUserInvestmentsInVault(address user, uint256 vaultId) public view returns(Investement[] memory){
        Investement [] memory investements = userInvestments[user];
        Investement [] memory investementsInVault = new Investement[](investements.length);

        uint8 counter = 0;
        for(uint8 i = 0; i < investements.length; i++){
            Investement memory tempInvestement = investements[i];
            if(tempInvestement.vaultId == vaultId){
                investementsInVault[counter] = tempInvestement;
                counter++;
            }      
        }

        return investementsInVault;
    }

	/**
	 *@dev Get user investements
	 */
	function getUserInvestements(address user) public view returns (Investement[] memory) {
		return userInvestments[user];
	}

    /**
	 *@dev Get vault investements
	 */
	function getVaultInvestements(uint256 vaultId) public view returns (Investement[] memory) {
		return vaultInvestements[vaultId];
	}

	/**
	 *@dev Get total vaults list
	 */
	function getVaultsList() public view returns (Vault[] memory) {
		return vaultsList;
	}

    modifier onlyVaultTrader (uint256 vaultId){
        Vault memory vault = vaultsMap[vaultId];
        require(vault.trader.traderWallet == msg.sender, "User is not the vault trader");
        _;
    }

    modifier vaultOpened (uint256 vaultId, uint256 investment){
        Vault memory vault = vaultsMap[vaultId];
        require(vault.state == VaultState.OPEN, "The vault is closed");
        require(vault.vaultId > 0, "Vault does not exist");
        require(investment > vault.minimumInvestment, "Investment is less than minimum investment");
        _;
    }
}