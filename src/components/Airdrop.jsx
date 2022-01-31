import React, { useEffect, useState } from "react";

const Airdrop = ({stakingBalance}) => {
  const [isActive, setIsActive] = useState(false);
  const [totalSec, setTotalSec] = useState(60);
  const getTimeLeft = (time) => {
    var hours =
      Math.floor(time / 3600) < 10
        ? ("00" + Math.floor(time / 3600)).slice(-2)
        : Math.floor(time / 3600);
    var minutes = ("00" + Math.floor((time % 3600) / 60)).slice(-2);
    var seconds = ("00" + ((time % 3600) % 60)).slice(-2);
    return `${hours}:${minutes}:${seconds}`;
  };
  useEffect(() => {
    let stake = stakingBalance ;
    if (stake >= '50000000000000000000' && !isActive) {
      setIsActive(true);
    }
  }, [isActive]);

  useEffect(() => {
    // exit early when we reach 0
    if (!isActive) return;
    if (!totalSec) return;

    // save intervalId to clear the interval when the
    // component re-renders
    const intervalId = setInterval(() => {
      setTotalSec(totalSec - 1);
    }, 1000);

    // clear interval on re-render to avoid memory leaks
    return () => clearInterval(intervalId);
    // add timeLeft as a dependency to re-rerun the effect
    // when we update it
  }, [totalSec , isActive]);

  return (
    <div>
      {getTimeLeft(totalSec)}
    </div>
  );
};

export default Airdrop;
