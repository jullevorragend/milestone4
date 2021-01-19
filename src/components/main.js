import { Menu, Row, Col } from "antd";
import { observer } from "mobx-react";
import React, { useEffect } from "react";
import { MainStore } from "./mainstore";
import "antd/dist/antd.css";
import { AddPerson } from "./addPerson";
import { Liste } from "./liste";

export const Main = observer(() => {
	const Store = MainStore;
	useEffect(() => {
		Store.init();
	}, []);

	return (
		<Row style={{ height: "100%" }}>
			<Col style={{ height: "100%" }} span={4}>
				<Menu theme="dark" mode="inline" style={{ height: "100%" }}>
					<Menu.Item onClick={() => (Store.currentPage = "list")}>
						Liste der Impfwilligen
					</Menu.Item>
					<Menu.Item onClick={() => (Store.currentPage = "add")}>
						Impfwilligen Hinzufügen
					</Menu.Item>
					<Menu.Item>Impfwillige vergleichen</Menu.Item>
				</Menu>
			</Col>
			{Store.currentPage === "def" ? (
				<Col>
					<div>Content</div>
				</Col>
			) : Store.currentPage === "add" ? (
				<AddPerson></AddPerson>
			) : Store.currentPage === "list" ? (
				<Liste></Liste>
			) : (
				<Col>Hiersnix</Col>
			)}
		</Row>
	);
});
