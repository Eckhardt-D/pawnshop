import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Layout from "../components/Layout";
import { Typography } from "@material-ui/core";

function Payment() {
  const [paytoday, setPaytoday] = useState(null);
  const [buttonCreated, setButtonCreated] = useState(false);

  const getSearchParam = (name) => {
    if (typeof window === "undefined") return;
    return new URLSearchParams(window.location.search).get(name);
  };

  const buttonContainer = React.createRef();
  const amount = getSearchParam("amount");
  const ref = getSearchParam("ref");

  useEffect(() => {
    const getPaytoday = async () => {
      const { initializePaytoday } = await import("paytoday");

      try {
        const paytoday = await initializePaytoday({
          debug: true,
        });
        setPaytoday(paytoday);
      } catch (__) {
        return;
      }
    };

    if (!paytoday) {
      getPaytoday();
    } else if (!buttonCreated) {
      paytoday.createButton(
        buttonContainer.current,
        Number(amount),
        ref,
        "http://localhost:3000/api/confirm-payment"
      );

      setButtonCreated(true);
    }
  });

  return (
    <Layout title="Home">
      <Typography gutterBottom variant="h6" color="textPrimary" component="h1">
        Pay with PayToday
      </Typography>
      {amount} | {ref}
      <div ref={buttonContainer}>Fallback</div>
    </Layout>
  );
}

export default dynamic(() => Promise.resolve(Payment), {
  ssr: false,
});
