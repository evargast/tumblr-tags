import React, {
    createContext,
    FC,
    useContext,
    useEffect,
    useState,
} from "react";

interface ParsedTumblrData {
    type: string;
    blogName: string;
    postUrl: string;
    tags: string[];
    imgUrl: string;
}

function initTumblrProvider() {
    const [tag, setTag] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState<ParsedTumblrData[]>([]);

    useEffect(() => {
        if (tag) {
            setIsLoading(true);
            fetch(
                `https://api.tumblr.com/v2/tagged?tag=${tag}&api_key=${TUMBLR_KEY}&limit=50`,
            )
                .then(response => response.json())
                .then(data => {
                    const parsedData = data.response.map(
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        (searchResults: Record<string, any>) => {
                            if (searchResults.type === "photo") {
                                return {
                                    type: searchResults.type,
                                    blogName: searchResults.blog_name,
                                    postUrl: searchResults.post_url,
                                    tags: searchResults.tags,
                                    imgUrl: searchResults?.photos[0]
                                        .original_size.url,
                                } as ParsedTumblrData;
                            } else {
                                return;
                            }
                        },
                    );
                    setData(parsedData.filter(Boolean));
                    setIsLoading(false);
                });
        }
    }, [tag]);

    const context = {
        isLoading,
        tag,
        setTag,
        data,
    };

    return context;
}

type TumblrContext = ReturnType<typeof initTumblrProvider>;

const TumblrContext = createContext({} as TumblrContext);

const TumblrProvider: FC = ({ children }) => {
    return (
        <TumblrContext.Provider value={initTumblrProvider()}>
            {children}
        </TumblrContext.Provider>
    );
};

const useTumblrData = (): TumblrContext => {
    return useContext(TumblrContext);
};

export { useTumblrData, TumblrContext, TumblrProvider };
