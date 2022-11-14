import React, { lazy } from "react";

const Create = lazy(() => import("./pages/Create"));
const List = lazy(() => import("./pages/List"));
const Update = lazy(() => import("./pages/Update"));
const Category = lazy(() => import("./pages/Category"));
const Tariff = lazy(() => import("./pages/Tariff"));
const Document = lazy(() => import("./pages/Document"));
const ComplexUsers = lazy(() => import("./pages/ComplexUsers"));

export const ComplexRoutes = [
	{
		index: true,
		element: <List />,
	},
	{
		path: "category",
		element: <Category />,
	},
	{
		path: "complex/create",
		element: <Create />,
	},
	{
		path: "complex/update/:complexID",
		element: <Update />,
	},
	{
		path: "tariff/:complexID",
		element: <Tariff />,
	},
	{
		path: "complex/:complexID/document",
		element: <Document />,
	},
	{
		path: "complex-user/:complexID",
		element: <ComplexUsers />,
	},
];
