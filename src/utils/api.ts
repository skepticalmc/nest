import axios from "axios";
import { API_URL } from "./constants";
import { ExternalBot } from "./types";

type GetExternalBotResponse = {
    bot: ExternalBot;
};

type GetExternalUserResponse = {
    user: Record<string, any>;
};

export const getExternalBot = async (botId: string) => await axios.get<GetExternalBotResponse>(`${API_URL}/external-bots/${botId}`)
.then((res) => res.data);

export const getExternalUser = async (userId: string) => await axios.get<GetExternalUserResponse>(`${API_URL}/users/${userId}`)
.then((res) => res.data);