// Import Solana web3 functinalities
const {
    Connection,
    PublicKey,
    clusterApiUrl,
    LAMPORTS_PER_SOL,
  } = require("@solana/web3.js");
  
  const airDropSol = async () => {

    const userAccWallet = process.argv[2];

    try{

        const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
        
        console.log('Airdropping 1 SOL to user wallet: ${userAccWallet}!');

        const fromAirDropSignature = await connection.requestAirdrop(
            new PublicKey(userAccWallet),
            1 * LAMPORTS_PER_SOL
        );
        
        await connection.confirmTransaction(fromAirDropSignature);

    } catch (err){
        console.log(err);
    }
  };

  const mainFunction = async() => {
      await airDropSol();
  };

  mainFunction();
