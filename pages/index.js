import { useEffect, useState } from "react";
import Web3 from "web3";
import Navbar from "../src/components/Navbar";
import styles from "../styles/Home.module.css";

import Tether from "../src/truffle_abis/Tether.json";
import RWD from "../src/truffle_abis/RWD.json";
import DecentralBank from "../src/truffle_abis/DecentralBank.json";
import Main from "../src/components/Main/Main";

export default function Home() {
  const [account, setAccount] = useState("0x0");
  const [tether, setTether] = useState({});
  const [rwd, setRwd] = useState({});
  const [decentralBank, setDecentralBank] = useState({});
  const [tetherBalance, setTetherBalance] = useState("0");
  const [rwdBalance, setRwdBalance] = useState("0");
  const [stakingBalance, setStakingBalance] = useState("0");
  const [loading, setLoading] = useState(true);

  const loadWeb3 = async () => {
    if (window.ethereuem) {
      window.web3 = new Web3(window.ethereuem);
      await window.ethereuem.enable();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert("Install metamask");
    }
  };

  const loadBolckchainData = async () => {
    const currentAccount = await window.web3.eth.getAccounts();
    if (!currentAccount[0]) {
      alert("No wallet found");
    }
    if (!currentAccount[0]) return;
    setAccount(currentAccount[0]);
    const netId = await window.web3.eth.net.getId();

    // Load Tether Contract
    const tetherData = Tether.networks[netId];
    if (tetherData) {
      const tetherContract = new window.web3.eth.Contract(
        Tether.abi,
        tetherData.address
      );
      setTether(tetherContract);
      let balanceOfTether = await tetherContract.methods
        .balanceOf(currentAccount[0])
        .call();

      setTetherBalance(balanceOfTether.toString());
    } else {
      window.alert("Tether Contract not deployed");
    }

    // Load RWD Contract
    const rwdData = RWD.networks[netId];
    if (rwdData) {
      const rwdContract = new window.web3.eth.Contract(
        RWD.abi,
        rwdData.address
      );
      setRwd(rwdContract);
      let balanceOfRwd = await rwdContract.methods
        .balanceOf(currentAccount[0])
        .call();

      setRwdBalance(balanceOfRwd.toString());
    } else {
      window.alert("RWD Contract not deployed");
    }

    // Load DecentralBank Contract
    const decentralBankData = DecentralBank.networks[netId]; // network's data
    if (decentralBankData) {
      const decentralBankContract = new window.web3.eth.Contract(
        DecentralBank.abi,
        decentralBankData.address
      );
      setDecentralBank(decentralBankContract);
      let stakingBalanceDecentralBank = await decentralBankContract.methods
        .stakingBalance(currentAccount[0])
        .call();

      setStakingBalance(stakingBalanceDecentralBank.toString());
    } else {
      window.alert("DecentralBank Contract not deployed");
    }
    setLoading(false);
  };

  // Staking function proccess
  // 1 Approve stake
  // 2 complete stake

  // staking function
  const stakeTokens = async (amount) => {
    setLoading(true);
    tether.methods
      .approve(decentralBank._address, amount)
      .send({ from: account })
      .on("transactionHash", (hash) => {
        decentralBank.methods
          .depositeTokens(amount)
          .send({ from: account })
          .on("transactionHash", (hash) => {
            setLoading(false);
          });
      });
  };
  // unstaking function
  const unstakeTokens = () => {
    setLoading(true);
    decentralBank.methods
      .unstakeTokens()
      .send({ from: account })
      .on("transactionHash", (hash) => {
        setLoading(false);
      });
  };

  useEffect(() => {
    loadWeb3();
    loadBolckchainData();
  }, []);

  return (
    <>
      <Navbar account={account} />
      {loading ? (
        <p id="loader" className="text-center" style={{ marginTop: "10rem" }}>
          {" "}
          LOADING....{" "}
        </p>
      ) : (
        <>
          <div className="container-fluid mt-5">
            <div className="row">
              <main
                role="main"
                className="col-lg-12 ml-auto mr-auto"
                style={{ maxWidth: "60rem", minHeight: "100vm" }}
              >
                <div>
                  <Main
                    tetherBalance={tetherBalance}
                    rwdBalance={rwdBalance}
                    stakingBalance={stakingBalance}
                    stakeTokens={stakeTokens}
                    unstakeTokens={unstakeTokens}
                  />
                </div>
              </main>
            </div>
          </div>
        </>
      )}
    </>
  );
}
