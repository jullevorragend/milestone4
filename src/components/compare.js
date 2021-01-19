import { Card } from "antd";
import { observer } from "mobx-react-lite";
import { MainStore } from "./mainstore";

export const Compare = observer(() => {
	const Store = MainStore;
	return (
		<Card title="Impfwillige" style={{ width: "100%" }}>
			{Store.currentCompareData.length > 1
				? Store.compareTwoAndGiveAnswerString(
						Store.currentCompareData[0],
						Store.currentCompareData[1]
				  ).reason
				: "Keine Impfwilligen ausgewählt!"}
		</Card>
	);
});
