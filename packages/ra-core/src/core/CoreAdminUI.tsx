import * as React from 'react';
import { createElement, FunctionComponent, ComponentType } from 'react';
import { Switch, Route } from 'react-router-dom';

import CoreAdminRouter from './CoreAdminRouter';
import { Ready } from '../util';
import {
    TitleComponent,
    LoginComponent,
    LayoutComponent,
    CoreLayoutProps,
    AdminChildren,
    CatchAllComponent,
    CustomRoutes,
    DashboardComponent,
    LoadingComponent,
} from '../types';

export type ChildrenFunction = () => ComponentType[];

const DefaultLayout: FunctionComponent<CoreLayoutProps> = ({ children }) => (
    <>{children}</>
);

export interface AdminUIProps {
    catchAll?: CatchAllComponent;
    children?: AdminChildren;
    customRoutes?: CustomRoutes;
    dashboard?: DashboardComponent;
    disableTelemetry?: boolean;
    layout?: LayoutComponent;
    loading?: LoadingComponent;
    loginPage?: LoginComponent | boolean;
    logout?: ComponentType;
    menu?: ComponentType;
    ready?: ComponentType;
    theme?: object;
    title?: TitleComponent;
}

// for BC
export type CoreAdminUIProps = AdminUIProps;

const CoreAdminUI: FunctionComponent<AdminUIProps> = ({
    catchAll = Noop,
    children,
    customRoutes = [],
    dashboard,
    disableTelemetry = false,
    layout = DefaultLayout,
    loading = Noop,
    loginPage = false,
    logout,
    menu, // deprecated, use a custom layout instead
    ready = Ready,
    theme,
    title = 'React Admin',
}) => {
    return (
        <>
            {process.env.NODE_ENV === 'production' &&
            disableTelemetry !== true &&
            typeof window !== 'undefined' ? (
                <img
                    src={`https://imfoxncoya.execute-api.eu-west-3.amazonaws.com/prod?domain=${window.location.hostname}`}
                    width="0"
                    height=""
                    alt=""
                />
            ) : null}
            <Switch>
                {loginPage !== false && loginPage !== true ? (
                    <Route
                        exact
                        path="/login"
                        render={props =>
                            createElement(loginPage, {
                                ...props,
                                title,
                                theme,
                            })
                        }
                    />
                ) : null}
                <Route
                    path="/"
                    render={props => (
                        <CoreAdminRouter
                            catchAll={catchAll}
                            customRoutes={customRoutes}
                            dashboard={dashboard}
                            layout={layout}
                            loading={loading}
                            logout={logout && createElement(logout)}
                            menu={menu}
                            ready={ready}
                            theme={theme}
                            title={title}
                            {...props}
                        >
                            {children}
                        </CoreAdminRouter>
                    )}
                />
            </Switch>
        </>
    );
};

const Noop = () => null;

export default CoreAdminUI;
