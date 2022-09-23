import { lightTheme, Provider, View } from "@adobe/react-spectrum";
import { LandingPage } from "components/LandingPage";
import { TumblrProvider } from "providers/TumblrProvider";
import React, { FC } from "react";

import "./App.css";

const App: FC = () => {
    return (
        <Provider theme={lightTheme} colorScheme="light" height="100vh">
            <TumblrProvider>
                <View paddingTop="size-400">
                    <h1 className="App">Tumblr Tag Search</h1>
                </View>
                <LandingPage />
            </TumblrProvider>
        </Provider>
    );
};

export { App };
