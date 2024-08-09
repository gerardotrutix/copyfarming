import { createThirdwebClient } from "thirdweb";

const clientId = "6974655401407817a3b7620481d6c169";

if (!clientId) {
  throw new Error("No client Id provided");
}

export const thirdWebClient = createThirdwebClient({ clientId: clientId });
