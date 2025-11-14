import { useSuiClientQueries } from "@mysten/dapp-kit";
import { Flex, Heading, Text, Card, Badge, Grid } from "@radix-ui/themes";
import { useNetworkVariable } from "../networkConfig";

export default function EventsHistory() {
  const packageId = useNetworkVariable("packageId");

  const eventQueries = useSuiClientQueries({
    queries: [
      // Hero Created
      {
        method: "queryEvents",
        params: {
          query: { MoveEventType: `${packageId}::hero::HeroCreated` },
          limit: 20,
          order: "descending",
        },
        queryKey: ["HeroCreated", packageId],
        enabled: !!packageId,
      },

      // Hero Listed
      {
        method: "queryEvents",
        params: {
          query: { MoveEventType: `${packageId}::marketplace::HeroListed` },
          limit: 20,
          order: "descending",
        },
        queryKey: ["HeroListed", packageId],
        enabled: !!packageId,
      },

      // Hero Bought
      {
        method: "queryEvents",
        params: {
          query: { MoveEventType: `${packageId}::marketplace::HeroBought` },
          limit: 20,
          order: "descending",
        },
        queryKey: ["HeroBought", packageId],
        enabled: !!packageId,
      },

      // Hero Delisted
      {
        method: "queryEvents",
        params: {
          query: { MoveEventType: `${packageId}::marketplace::HeroDelisted` },
          limit: 20,
          order: "descending",
        },
        queryKey: ["HeroDelisted", packageId],
        enabled: !!packageId,
      },

      // Price Changed
      {
        method: "queryEvents",
        params: {
          query: { MoveEventType: `${packageId}::marketplace::HeroPriceChanged` },
          limit: 20,
          order: "descending",
        },
        queryKey: ["HeroPriceChanged", packageId],
        enabled: !!packageId,
      },

      // Arena Created
      {
        method: "queryEvents",
        params: {
          query: { MoveEventType: `${packageId}::arena::ArenaCreated` },
          limit: 20,
          order: "descending",
        },
        queryKey: ["ArenaCreated", packageId],
        enabled: !!packageId,
      },

      // Arena Completed
      {
        method: "queryEvents",
        params: {
          query: { MoveEventType: `${packageId}::arena::ArenaCompleted` },
          limit: 20,
          order: "descending",
        },
        queryKey: ["ArenaCompleted", packageId],
        enabled: !!packageId,
      },
    ],
  });

  // Destructure event data
  const [
    { data: heroCreated },
    { data: listedEvents },
    { data: boughtEvents },
    { data: delistedEvents },
    { data: priceChangedEvents },
    { data: arenaCreatedEvents },
    { data: arenaCompletedEvents },
  ] = eventQueries;

  const formatTimestamp = (timestamp: string) =>
    new Date(Number(timestamp)).toLocaleString();

  const formatAddress = (address: string) =>
    `${address.slice(0, 6)}...${address.slice(-4)}`;

  const formatPrice = (p: string) =>
    (Number(p) / 1_000_000_000).toFixed(2);

  const allEvents = [
    ...(heroCreated?.data || []).map((e) => ({ ...e, type: "created" })),
    ...(listedEvents?.data || []).map((e) => ({ ...e, type: "listed" })),
    ...(boughtEvents?.data || []).map((e) => ({ ...e, type: "bought" })),
    ...(delistedEvents?.data || []).map((e) => ({ ...e, type: "delisted" })),
    ...(priceChangedEvents?.data || []).map((e) => ({ ...e, type: "price_changed" })),
    ...(arenaCreatedEvents?.data || []).map((e) => ({ ...e, type: "arena_created" })),
    ...(arenaCompletedEvents?.data || []).map((e) => ({ ...e, type: "arena_completed" })),
  ].sort((a, b) => Number(b.timestampMs) - Number(a.timestampMs));

  return (
    <Flex direction="column" gap="4">
      <Heading size="6">Recent Events ({allEvents.length})</Heading>

      {allEvents.length === 0 ? (
        <Card><Text>No events found</Text></Card>
      ) : (
        <Grid columns="1" gap="3">
          {allEvents.map((event, index) => {
            const d = event.parsedJson as any;

            return (
              <Card key={`${event.id.txDigest}-${index}`} style={{ padding: "16px" }}>
                <Flex direction="column" gap="2" >

                  {/* Badge */}
                  <Flex align="center" gap="3">
                    <Badge
                      color={
                        event.type === "created"
                          ? "purple"
                          : event.type === "listed"
                          ? "blue"
                          : event.type === "bought"
                          ? "green"
                          : event.type === "delisted"
                          ? "yellow"
                          : event.type === "price_changed"
                          ? "orange"
                          : event.type === "arena_created"
                          ? "indigo"
                          : "red"
                      }
                    >
                      {
                        {
                          created: "Hero Created",
                          listed: "Hero Listed",
                          bought: "Hero Bought",
                          delisted: "Hero Delisted",
                          price_changed: "Price Changed",
                          arena_created: "Arena Created",
                          arena_completed: "Battle Completed",
                        }[event.type]
                      }
                    </Badge>

                    <Text size="3" color="gray">
                      {formatTimestamp(event.timestampMs!)}
                    </Text>
                  </Flex>

                  {/* Event Details */}
                  <Flex gap="4" wrap="wrap">
                    {event.type === "created" && (
                      <Text><strong>Hero ID:</strong> ...{d.hero_id.slice(-8)}</Text>
                    )}

                    {event.type === "listed" && (
                      <>
                        <Text><strong>Price:</strong> {formatPrice(d.price)} SUI</Text>
                        <Text><strong>Seller:</strong> {formatAddress(d.seller)}</Text>
                      </>
                    )}

                    {event.type === "bought" && (
                      <>
                        <Text><strong>Price:</strong> {formatPrice(d.price)} SUI</Text>
                        <Text><strong>Buyer:</strong> {formatAddress(d.buyer)}</Text>
                        <Text><strong>Seller:</strong> {formatAddress(d.seller)}</Text>
                      </>
                    )}

                    {event.type === "delisted" && (
                      <Text><strong>Seller:</strong> {formatAddress(d.seller)}</Text>
                    )}

                    {event.type === "price_changed" && (
                      <>
                        <Text><strong>Old:</strong> {formatPrice(d.old_price)} SUI</Text>
                        <Text><strong>New:</strong> {formatPrice(d.new_price)} SUI</Text>
                      </>
                    )}

                    {event.type === "arena_created" && (
                      <Text><strong>Arena ID:</strong> ...{d.arena_id.slice(-8)}</Text>
                    )}

                    {event.type === "arena_completed" && (
                      <>
                        <Text><strong>🏆 Winner:</strong> ...{d.winner_hero_id.slice(-8)}</Text>
                        <Text><strong>💀 Loser:</strong> ...{d.loser_hero_id.slice(-8)}</Text>
                      </>
                    )}
                  </Flex>

                </Flex>
              </Card>
            );
          })}
        </Grid>
      )}
    </Flex>
  );
}