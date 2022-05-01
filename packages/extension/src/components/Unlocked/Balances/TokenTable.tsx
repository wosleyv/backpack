import { useState } from "react";
import { makeStyles, Typography, ListItem } from "@material-ui/core";
import { ArrowForwardIos, OfflineBolt as Bolt } from "@material-ui/icons";
import {
  BalancesTable,
  BalancesTableHead,
  BalancesTableRow,
  BalancesTableCell,
  BalancesTableContent,
} from "@200ms/anchor-ui-renderer";
import {
  useBlockchainLogo,
  useBlockchainTokensSorted,
  useNavigation,
} from "@200ms/recoil";
import { toTitleCase, NAV_COMPONENT_TOKEN } from "@200ms/common";

const useStyles = makeStyles((theme: any) => ({
  blockchainFooter: {
    borderTop: `solid 1pt ${theme.custom.colors.border}`,
    display: "flex",
    justifyContent: "space-between",
    paddingLeft: "16px",
    paddingRight: "16px",
    paddingTop: "6px",
    paddingBottom: "6px",
    height: "36px",
  },
  footerArrowIcon: {
    width: "10px",
    color: theme.custom.colors.secondary,
  },
  footerLabel: {
    fontSize: "14px",
    weight: 500,
    color: theme.custom.colors.fontColor,
  },
  balancesHeaderContainer: {
    display: "flex",
    justifyContent: "space-between",
    paddingLeft: "12px",
    paddingRight: "12px",
    marginLeft: "12px",
    marginRight: "12px",
    paddingTop: "12px",
    paddingBottom: "12px",
    borderRadius: "12px",
    backgroundColor: theme.custom.colors.nav,
    marginBottom: "12px",
  },
  positive: {
    color: theme.custom.colors.positive,
    fontSize: "12px",
    lineHeight: "24px",
  },
  negative: {
    color: theme.custom.colors.negative,
    fontSize: "12px",
    lineHeight: "24px",
  },
  cardAvatar: {
    display: "flex",
  },
}));

export function TokenTable() {
  const blockchain = "solana";
  const title = "Tokens";
  const limit = 3;

  const blockchainLogo = useBlockchainLogo(blockchain);
  const tokenAccountsSorted = useBlockchainTokensSorted(blockchain);
  const [showAll, setShowAll] = useState(false);
  return (
    <BalancesTable>
      <BalancesTableHead props={{ title, iconUrl: blockchainLogo }} />
      <BalancesTableContent>
        {tokenAccountsSorted
          .slice(0, limit && !showAll ? limit : tokenAccountsSorted.length)
          .filter((t: any) => t.nativeBalance !== 0)
          .map((token: any) => (
            <TokenRow
              key={token.address}
              token={token}
              blockchain={blockchain}
            />
          ))}
      </BalancesTableContent>
      <BalancesTableFooter
        count={tokenAccountsSorted.length}
        showAll={showAll}
        setShowAll={setShowAll}
      />
    </BalancesTable>
  );
}

function TokenRow({ token, blockchain }: { token: any; blockchain: string }) {
  const { push: pushNavigation } = useNavigation();
  return (
    <BalancesTableRow
      onClick={() => {
        pushNavigation({
          title: `${toTitleCase(blockchain)} / ${token.ticker}`,
          componentId: NAV_COMPONENT_TOKEN,
          componentProps: {
            blockchain,
            address: token.address,
          },
        });
      }}
    >
      <BalancesTableCell
        props={{
          icon: token.logo,
          title: token.ticker,
          subtitle: `${token.nativeBalance.toLocaleString()} ${token.ticker}`,
          usdValue: token.usdBalance,
          percentChange: token.recentUsdBalanceChange,
        }}
      />
    </BalancesTableRow>
  );
}

export function BalancesTableFooter({ count, showAll, setShowAll }: any) {
  return (
    <TokenTableFooter
      showAll={showAll}
      onClick={() => setShowAll((showAll: boolean) => !showAll)}
      count={count}
    />
  );
}

function TokenTableFooter({
  showAll,
  onClick,
  count,
}: {
  showAll: boolean;
  onClick: () => void;
  count: number;
}) {
  const classes = useStyles();
  return (
    <ListItem
      button
      disableRipple
      className={classes.blockchainFooter}
      onClick={onClick}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <Typography className={classes.footerLabel}>
          {showAll ? `Hide ${count}` : `Show all ${count}`}
        </Typography>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <ArrowForwardIos className={classes.footerArrowIcon} />
      </div>
    </ListItem>
  );
}