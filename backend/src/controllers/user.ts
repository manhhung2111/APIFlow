import {Request, Response} from "express";
import {Code, HTMLInput, JWT} from "@ap/core";
import {DBUser, DBUserLoader} from "@dev/user";
import UserService from "@services/user";
import logger from "@utils/logger";
import Client from "@dev/client";
import {DBWorkspace, DBWorkspaceLoader} from "@dev/workspace";

export const loginUser = async (request: Request, response: Response) => {
    try {
        const user = await UserService.login();

        const users = await DBUserLoader.all();
        const usersRelease = users.map(user => user.releaseCompact());

        const cookies_key = `recent.workspaces.${user.object!._id.toString()}`;
        let workspaces: object[] = [];
        if (!HTMLInput.cookies(cookies_key)) {
            const workspaces_loader = await DBWorkspaceLoader.mine();
            for (let i = 0; i < Math.min(5, workspaces_loader.length); i++) {
                workspaces.push(workspaces_loader[i].releaseCompact());
            }
        } else {
            const recent_workspace_ids = HTMLInput.cookies(cookies_key) ? JSON.parse(HTMLInput.cookies(cookies_key)) : [];
            for (const workspace_id of recent_workspace_ids) {
                const workspace = await DBWorkspace.initialize(workspace_id) as DBWorkspace;
                if (!workspace.good()) {
                    continue;
                }

                workspaces.push(workspace.releaseCompact());
            }
        }

        const access_token = await JWT.signToken({user_id: user.getField("_id")});
        response.clearCookie("access_token");

        const ttl = HTMLInput.inputFlag("remember") ? 1000 * 60 * 60 * 24 * 7 : null;
        console.log(HTMLInput.inputFlag("remember"), ttl);
        response.cookie("access_token", access_token, {signed: true, ...(ttl ? {maxAge: ttl} : {}), httpOnly: true});
        response.status(200).json(Code.success("Login successful", {
            user: user.release(),
            users: usersRelease,
            workspaces: workspaces
        }));
    } catch (error) {
        logger.error((error as Error).stack);
        response.status(500).json(Code.error((error as Error).message));
    }
};

export const registerUser = async (request: Request, response: Response) => {
    try {
        const user = await DBUser.initialize() as DBUser;

        await user.reader().read();

        await user.save();

        response.status(201).json(Code.success("Register new account successfully!"));
    } catch (error) {
        logger.error((error as Error).stack);
        response.status(500).json(Code.error((error as Error).message));
    }
};

export const forgotPassword = async (request: Request, response: Response) => {

};

export const resetPassword = async (request: Request, response: Response) => {

};

export const verifyUser = async (request: Request, response: Response) => {
    logger.info("[Controller] Verify user");
    try {
        const token = HTMLInput.signedCookies("access_token");

        if (!token) {
            response.status(401).json(Code.error("Authorization token required"));
            return;
        }

        const payload = await JWT.verifyToken(token);
        if (typeof payload === "string") {
            response.status(401).json(Code.error("Invalid or missing user_id in token payload"));
            return;
        }

        const user = await Client.authenticate(payload.user_id);
        if (!user) {
            response.status(401).json(Code.error("Cannot authenticate user."));
            return;
        }

        const users = await DBUserLoader.all();
        const usersRelease = users.map(user => user.releaseCompact());

        const cookies_key = `recent.workspaces.${user.object!._id.toString()}`;
        let workspaces: object[] = [];
        if (!HTMLInput.cookies(cookies_key)) {
            const workspaces_loader = await DBWorkspaceLoader.mine();
            for (let i = 0; i < Math.min(5, workspaces_loader.length); i++) {
                workspaces.push(workspaces_loader[i].releaseCompact());
            }
        } else {
            const recent_workspace_ids = HTMLInput.cookies(cookies_key) ? JSON.parse(HTMLInput.cookies(cookies_key)) : [];
            for (const workspace_id of recent_workspace_ids) {
                const workspace = await DBWorkspace.initialize(workspace_id) as DBWorkspace;
                if (!workspace.good()) {
                    continue;
                }

                workspaces.push(workspace.releaseCompact());
            }
        }

        response.status(200).json(Code.success("User verified successful", {
            user: user.release(), users: usersRelease,
            workspaces: workspaces
        }));
    } catch (error) {
        logger.error((error as Error).stack);
        response.status(500).json(Code.error((error as Error).message));
    }
};

export const logoutUser = async (request: Request, response: Response) => {
    const token = HTMLInput.signedCookies("access_token");

    if (!token) {
        response.status(401).json(Code.error("Authorization token required"));
        return;
    }

    const payload = await JWT.verifyToken(token);
    if (typeof payload === "string") {
        response.status(401).json(Code.error("Invalid or missing user_id in token payload"));
        return;
    }

    response.cookie("access_token", "", {signed: true, maxAge: 0, httpOnly: true});
    response.status(200).json(Code.success("Logout successful"));
};

export const searchUsers = async (request: Request, response: Response) => {
    logger.info("[Controller] Search users by query")
    try {
        const users = await DBUserLoader.searchByQuery();

        const usersRelease = users.map(user => user.releaseCompact());

        response.status(201).json(Code.success("Fetch user successfully", {users: usersRelease}));
    } catch (error) {
        logger.error((error as Error).stack);
        response.status(500).json(Code.error((error as Error).message));
    }
};

export const getAllUsers = async (request: Request, response: Response) => {
    logger.info("[Controller] Get all users")
    try {
        const users = await DBUserLoader.all();

        const usersRelease = users.map(user => user.releaseCompact());

        response.status(201).json(Code.success("Get all users successfully", {users: usersRelease}));
    } catch (error) {
        logger.error((error as Error).stack);
        response.status(500).json(Code.error((error as Error).message));
    }
};

export const loginGoogleUser = async (request: Request, response: Response) => {
    try {
        const payload = await UserService.loginGoogle();
        if (!payload) {
            response.status(401).json(Code.error("Invalid or missing user"));
            return;
        }
        const {email, name, sub} = payload;

        const user = await DBUserLoader.byEmail(email!);
        let userRelease: any;
        let cookies_key = "";

        if (!user || !user.object) {
            const newUser = await DBUser.initialize() as DBUser;
            if (!newUser || !newUser.object) {
                throw new Code("Something went wrong");
            }

            newUser.object.google_id = sub;
            newUser.object.name = name;
            newUser.object.email = email!;

            await newUser.save();

            userRelease = newUser.release();
            cookies_key = `recent.workspaces.${newUser.object!._id.toString()}`
        } else {
            user.object.google_id = sub;
            user.object.name = name;
            user.object.email = email!;

            await user.save();

            userRelease = user.release();
            cookies_key = `recent.workspaces.${user.object!._id.toString()}`
        }

        const users = await DBUserLoader.all();
        const usersRelease = users.map(user => user.releaseCompact());


        let workspaces: object[] = [];
        if (!HTMLInput.cookies(cookies_key)) {
            const workspaces_loader = await DBWorkspaceLoader.mine();
            for (let i = 0; i < Math.min(5, workspaces_loader.length); i++) {
                workspaces.push(workspaces_loader[i].releaseCompact());
            }
        } else {
            const recent_workspace_ids = HTMLInput.cookies(cookies_key) ? JSON.parse(HTMLInput.cookies(cookies_key)) : [];
            for (const workspace_id of recent_workspace_ids) {
                const workspace = await DBWorkspace.initialize(workspace_id) as DBWorkspace;
                if (!workspace.good()) {
                    continue;
                }

                workspaces.push(workspace.releaseCompact());
            }
        }

        const access_token = await JWT.signToken({user_id: userRelease._id});
        response.clearCookie("access_token");
        response.cookie("access_token", access_token, {signed: true, maxAge: 1000 * 60 * 60 * 24 * 7, httpOnly: true});
        response.status(200).json(Code.success("Login successful", {
            user: userRelease,
            users: usersRelease,
            workspaces: workspaces
        }));
    } catch (error) {
        logger.error((error as Error).stack);
        response.status(500).json(Code.error((error as Error).message));
    }
}
