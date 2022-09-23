import {
    ActionButton,
    ActionGroup,
    Content,
    Flex,
    Grid,
    Heading,
    IllustratedMessage,
    Item,
    Link,
    LogicButton,
    ProgressCircle,
    repeat,
    SearchField,
    Text,
    View,
} from "@adobe/react-spectrum";
import NoSearchResults from "@spectrum-icons/illustrations/NoSearchResults";
import ArrowUp from "@spectrum-icons/workflow/ArrowUp";
import Brackets from "@spectrum-icons/workflow/Brackets";
import Copy from "@spectrum-icons/workflow/Copy";
import ViewGrid from "@spectrum-icons/workflow/ViewGrid";
import { useTumblrData } from "providers/TumblrProvider";
import React, { FC, useState } from "react";

type DisplayType = "cards" | "json";

const LandingPage: FC = () => {
    const { setTag } = useTumblrData();
    const [searchTerm, setSearchTerm] = useState("");
    const [displayType, setDisplayType] = useState<DisplayType>("cards");

    const setSearchTag = (tag: string) => {
        setTag(tag);
        setSearchTerm(tag);
    };

    return (
        <Flex direction="column" marginX="size-400" height="100%">
            <Flex justifyContent="space-between">
                <SearchField
                    label="Search"
                    value={searchTerm}
                    onSubmit={setSearchTag}
                    onChange={setSearchTerm}
                />

                <ActionGroup
                    density="compact"
                    selectionMode="single"
                    isEmphasized
                    selectedKeys={[displayType]}
                    onAction={key => setDisplayType(key as DisplayType)}
                >
                    <Item key="cards" aria-label="Card view">
                        <ViewGrid />
                    </Item>
                    <Item key="json" aria-label="JSON View">
                        <Brackets />
                    </Item>
                </ActionGroup>
            </Flex>
            <LandingPageBody variant={displayType} />
        </Flex>
    );
};

const LandingPageBody: FC<{ variant: DisplayType }> = ({ variant }) => {
    const { data, isLoading, tag } = useTumblrData();

    if (isLoading) {
        return (
            <Flex
                justifyContent="center"
                alignContent="center"
                width="100%"
                height="100%"
            >
                <ProgressCircle
                    aria-label="Loading…"
                    isIndeterminate
                    size="M"
                />
            </Flex>
        );
    }

    if (data.length === 0) {
        if (tag !== "") {
            return (
                <IllustratedMessage>
                    <NoSearchResults />
                    <Heading>No matching results</Heading>
                    <Content>Try another search.</Content>
                </IllustratedMessage>
            );
        } else {
            return (
                <div>
                    Search for a tag!{" "}
                    <ArrowUp aria-label="XS ArrowUp" size="XS" />
                </div>
            );
        }
    }

    if (variant === "json") {
        return (
            <View backgroundColor="gray-200">
                <Flex justifyContent="end">
                    <ActionButton
                        onPress={() => {
                            navigator.clipboard.writeText(JSON.stringify(data));
                        }}
                    >
                        <Copy />
                        <Text>Copy</Text>
                    </ActionButton>
                </Flex>
                <pre style={{ overflow: "scroll" }}>
                    {JSON.stringify(data, null, 2)}
                </pre>
            </View>
        );
    }

    return (
        <Grid
            columns={repeat("auto-fit", "size-4600")}
            justifyContent="center"
            gap="size-100"
            marginX="size-200"
            marginTop="size-300"
            marginBottom="size-400"
        >
            {data.map((searchResult, i) => (
                <View
                    key={searchResult.blogName + i}
                    borderWidth="thin"
                    borderColor="dark"
                    borderRadius="medium"
                    padding="size-250"
                >
                    <Flex direction="column" gap="size-200">
                        <Link>
                            <a
                                href={searchResult.postUrl}
                                target="_blank"
                                rel="noreferrer"
                            >
                                {searchResult.blogName}
                            </a>
                        </Link>

                        <img
                            src={searchResult.imgUrl}
                            alt={searchResult.blogName}
                        />

                        <div>
                            {searchResult.tags.map((tag, i) => {
                                return (
                                    <LogicButton
                                        key={tag}
                                        width="fit-content"
                                        variant={i % 2 === 0 ? "and" : "or"}
                                    >
                                        {tag}
                                    </LogicButton>
                                );
                            })}
                        </div>
                    </Flex>
                </View>
            ))}
        </Grid>
    );
};

export { LandingPage };
