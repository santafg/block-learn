import Image from "next/image";
import Link from "next/link";
import React from "react";

function Navbar({account}) {
  return (
    <nav
      className="navbar navbar-dark fixed-top p-0"
      style={{ backgroundColor: "black", height: "4rem" }}
    >
      <Link href="/">
        <a
          className="navbar-brand col-sm-3 col-md-2 mr-0"
          style={{ color: "white" }}
        >
          DAPP Yield Staking (Decentralized Banking)
        </a>
      </Link>
      <ul className="navbar-nav px-3">
        <li className="text-nowrap nav-item d-sm-block">
          <small style={{ color: "white" }}>ACCOUNT NUMBER : {account} </small>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
