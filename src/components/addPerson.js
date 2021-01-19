import { observer } from "mobx-react-lite";
import {
	Card,
	Col,
	Input,
	Form,
	DatePicker,
	Button,
	Switch,
	Select,
} from "antd";
import { MainStore } from "./mainstore";

const { Option } = Select;
export const AddPerson = observer(() => {
	const Store = MainStore;
	const layout = {
		labelCol: { span: 8 },
		wrapperCol: { span: 16 },
	};
	const onFinish = (values) => {
		const newUser = values;
		newUser.dateOfBirth = newUser.dateOfBirth.unix();
		newUser.categorization = Store.categorize(newUser);
		Store.userDataSet.push(newUser);
		Store.currentPage = "list";
	};
	return (
		<Col span={18}>
			<Card title={"impfwilligen Hinzufügen"}>
				<Form {...layout} onFinish={onFinish}>
					<Form.Item
						label="name"
						name="name"
						rules={[{ required: true }]}
						initialValue={undefined}
					>
						<Input />
					</Form.Item>
					<Form.Item
						label="Geburtstag"
						name="dateOfBirth"
						rules={[{ required: true }]}
						initialValue={undefined}
					>
						<DatePicker></DatePicker>
					</Form.Item>
					<Form.Item
						label="coronaInfection"
						name="coronaInfection"
						valuePropName="checked"
						initialValue={false}
					>
						<Switch />
					</Form.Item>
					<Form.Item
						label="Personal in Medizinischer Einrichtung"
						name={[
							"fragebogen",
							"personal_in_medizinischer_einrichtung",
						]}
						valuePropName="checked"
						initialValue={false}
					>
						<Switch />
					</Form.Item>
					<Form.Item
						label="Expositionsrisiko"
						name={["fragebogen", "expositionsrisiko"]}
						initialValue={0}
					>
						<Select>
							<Option value={0}>keines</Option>
							<Option value={1}>Niedrig</Option>
							<Option value={2}>Moderat</Option>
							<Option value={3}>Hoch</Option>
						</Select>
					</Form.Item>
					<Form.Item
						label="Bewohner von Seniorenheim"
						name={["fragebogen", "bewohner_von_seniorenheim"]}
						valuePropName="checked"
						initialValue={false}
					>
						<Switch />
					</Form.Item>
					<Form.Item
						label="Pflegepersonal in Altenpflege"
						name={["fragebogen", "pflegepersonal_in_altenpflege"]}
						valuePropName="checked"
						initialValue={false}
					>
						<Switch />
					</Form.Item>
					<Form.Item
						label="Geistige Behinderung"
						name={["fragebogen", "geistige_behinderung"]}
						valuePropName="checked"
						initialValue={false}
					>
						<Switch />
					</Form.Item>
					<Form.Item
						label="Versorgung Personen geistige Behinderung"
						name={[
							"fragebogen",
							"versorgung_personen_geistige_behinderung",
						]}
						valuePropName="checked"
						initialValue={false}
					>
						<Switch />
					</Form.Item>
					<Form.Item
						label="Down Syndrom"
						name={["fragebogen", "down_syndrom"]}
						valuePropName="checked"
						initialValue={false}
					>
						<Switch />
					</Form.Item>
					<Form.Item
						label="Kontakt Zu Personen in Seniorenheim"
						name={[
							"fragebogen",
							"kontakt_zu_bewohner_in_seniorenheim",
						]}
						valuePropName="checked"
						initialValue={false}
					>
						<Switch />
					</Form.Item>
					<Form.Item
						label="organtransplantation"
						name={["fragebogen", "organtransplantation"]}
						valuePropName="checked"
						initialValue={false}
					>
						<Switch />
					</Form.Item>
					<Form.Item
						label="organtransplantation"
						name={["fragebogen", "organtransplantation"]}
						valuePropName="checked"
						initialValue={false}
					>
						<Switch />
					</Form.Item>
					<Form.Item
						label="Risiko von Vorerkrankung"
						name={["fragebogen", "vorerkrankung_risiko"]}
						initialValue={0}
					>
						<Select>
							<Option value={0}>keines</Option>
							<Option value={1}>Niedrig</Option>
							<Option value={2}>Moderat</Option>
							<Option value={3}>Hoch</Option>
						</Select>
					</Form.Item>
					<Form.Item
						label="Lehrer/Erzieher"
						name={["fragebogen", "lehrer_erzieher"]}
						valuePropName="checked"
						initialValue={false}
					>
						<Switch />
					</Form.Item>
					<Form.Item
						label="Prekäre Lebenssituation"
						name={["fragebogen", "prekäre_bedingungen"]}
						valuePropName="checked"
						initialValue={false}
					>
						<Switch />
					</Form.Item>
					<Form.Item
						label="Schlüsselpositionen der Landes/Bundesregierung"
						name={[
							"fragebogen",
							"schlüsselpositionen_der_landes_bundesregierung",
						]}
						valuePropName="checked"
						initialValue={false}
					>
						<Switch />
					</Form.Item>
					<Form.Item
						label="beschäftigte_einzelhandel"
						name={["fragebogen", "beschäftigte_einzelhandel"]}
						valuePropName="checked"
						initialValue={false}
					>
						<Switch />
					</Form.Item>
					<Form.Item
						label="personen_zur_aufrechterhaltung_der_öffentlichen_Sicherheit"
						name={[
							"fragebogen",
							"personen_zur_aufrechterhaltung_der_öffentlichen_Sicherheit",
						]}
						valuePropName="checked"
						initialValue={false}
					>
						<Switch />
					</Form.Item>
					<Form.Item
						label="berufe_der_kritischen_infrastruktur"
						name={[
							"fragebogen",
							"berufe_der_kritischen_infrastruktur",
						]}
						valuePropName="checked"
						initialValue={false}
					>
						<Switch />
					</Form.Item>
					<Form.Item>
						<Button type="primary" htmlType="submit">
							Submit
						</Button>
					</Form.Item>
				</Form>
			</Card>
		</Col>
	);
});
