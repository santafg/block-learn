import Image from "next/image";
import React, { useState } from "react";
import Airdrop from "../Airdrop";

const Main = ({
  tetherBalance,
  rwdBalance,
  stakingBalance,
  stakeTokens,
  unstakeTokens,
}) => {
  const [amount, setAmount] = useState("0");

  const handleDeposite = (e) => {
    e.preventDefault();
    const weiAmount = window.web3.utils.toWei(amount, "Ether");
    stakeTokens(weiAmount);
  };

  return (
    <div id="content" className="mt-3">
      <table className="table text-muted text-center">
        <thead>
          <tr style={{ color: "black" }}>
            <th scope="col">Staking balance</th>
            <th scope="col">Reward balance </th>
          </tr>
        </thead>
        <tbody>
          <tr style={{ color: "black" }}>
            <td>{window.web3.utils.fromWei(stakingBalance, "Ether")} USDT</td>
            <td>{window.web3.utils.fromWei(rwdBalance, "Ether")} RWD</td>
          </tr>
        </tbody>
      </table>
      <div className="card mb-2" style={{ opacity: ".9" }}>
        <form onSubmit={handleDeposite} className="mb-3">
          <div
            style={{
              borderSpacing: " 0 1em",
            }}
          >
            <label className="float-start" style={{ marginLeft: "15px" }}>
              <b>Stake Tokens</b>
            </label>
            <span className="float-end" style={{ marginRight: "8px" }}>
              Balance : {window.web3.utils.fromWei(tetherBalance, "Ether")} ETH
            </span>
            <div className="input-group mb-4">
              <input
                type="text"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
              <div className="input-group-open"></div>
              <div className="input-group-text">
                <div
                  style={{
                    position: "relative",
                    height: "2rem",
                    width: "2.6rem",
                  }}
                >
                  <Image src="/images/tether.png" layout="fill" alt={""} />
                </div>
                &nbsp;&nbsp;&nbsp; USDT
              </div>
            </div>
            <button type="submit" className="btn btn-primary btn-lg btn-block">
              DEPOSIT
            </button>
          </div>
        </form>
        <button
          onClick={unstakeTokens}
          className="btn btn-primary btn-lg btn-block"
        >
          WITHDRAW
        </button>
        <div className="card-body text-center " style={{ color: "blue" }}>
          AIRDROP <Airdrop stakingBalance={stakingBalance} />
        </div>
      </div>
    </div>
  );
};

export default Main;
