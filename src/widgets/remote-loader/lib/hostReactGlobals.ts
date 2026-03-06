'use client';

import React from 'react';
import * as ReactDOM from 'react-dom';
import { createRoot } from 'react-dom/client';
import * as ReactJSXRuntime from 'react/jsx-runtime';
import * as ReactJSXDevRuntime from 'react/jsx-dev-runtime';
import * as ReactQuery from '@tanstack/react-query';

declare global {
  interface Window {
    React?: typeof React;
    ReactDOM?: typeof ReactDOM & { createRoot: typeof createRoot };
    ReactJSXRuntime?: typeof ReactJSXRuntime;
    __HOST_REACT__?: typeof React;
    __HOST_REACT_DOM__?: typeof ReactDOM & { createRoot: typeof createRoot };
    __HOST_REACT_JSX__?: typeof ReactJSXRuntime;
    __HOST_REACT_JSX_DEV__?: typeof ReactJSXDevRuntime;
    __HOST_REACT_QUERY__?: typeof ReactQuery;
    
    __IMAGE_PROXY_BASE__?: string;
  }
}


export const exposeReactGlobals = () => {
  if (typeof window === 'undefined') return;
  const reactDOM = { ...ReactDOM, createRoot };
  window.React = React;
  window.ReactDOM = reactDOM;
  window.ReactJSXRuntime = ReactJSXRuntime;
  window.__HOST_REACT__ = React;
  window.__HOST_REACT_DOM__ = reactDOM;
  window.__HOST_REACT_JSX__ = ReactJSXRuntime;
  window.__HOST_REACT_JSX_DEV__ = ReactJSXDevRuntime;
  window.__HOST_REACT_QUERY__ = ReactQuery;
  window.__IMAGE_PROXY_BASE__ = window.location.origin;
};