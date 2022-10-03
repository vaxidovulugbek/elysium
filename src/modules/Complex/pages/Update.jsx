import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FastField, Field } from "formik";
import { get } from "lodash";

import { useFetchOne, useFetchOneWithId, useOverlay } from "hooks";

import Containers from "containers";
import { PageHeading, Fields, Button, MapPicker, SectionCard } from "components";
import SectionForm from "../components/SectionForm";

const Update = () => {
	const navigate = useNavigate();
	const modal = useOverlay("modal");
	const { complexID } = useParams();
	const [type, setType] = useState("Adding");

	const { data } = useFetchOne({
		url: `complex/${complexID}`,
		urlSearchParams: { include: "region,district" },
	});

	const section = useFetchOneWithId({
		url: "section",
		queryOptions: { enabled: false },
		refetchStatus: modal.isOpen,
	});

	const fetchSection = (e, id) => {
		e.stopPropagation();
		section.setId(id);
		setType("Updating");
		modal.handleOverlayOpen();
	};

	const createSection = () => {
		setType("Adding");
		modal.handleOverlayOpen();
		section.setId(null);
	};
	console.log(get(data, "name.uz"));
	return (
		<>
			<PageHeading
				title={`${get(data, "name.en", "")}`}
				links={[
					{ url: "/", name: "Control Panel" },
					{ url: "/", name: "My Complex" },
					{ url: "", name: `${get(data, "name.en", "")}` },
				]}
				complexID={complexID}
				hasButton={true}
			/>
			<Containers.Form
				url={`complex/${complexID}`}
				method="put"
				className="row"
				onSuccess={() => navigate(-1)}
				fields={[
					{
						name: "name",
						validationType: "object",
						validations: [{ type: "lng" }],
						value: get(data, "name"),
					},
					{
						name: "address",
						validationType: "object",
						validations: [{ type: "lng" }],
						value: get(data, "address"),
					},
					{
						name: "region_id",
						validationType: "object",
						value: {
							value: get(data, "region.id"),
							label: get(data, "region.name.uz"),
						},
						onSubmitValue: (e) => get(e, "value"),
					},
					{
						name: "district_id",
						validationType: "object",
						value: {
							value: get(data, "district.id"),
							label: get(data, "district.name.uz"),
						},
						onSubmitValue: (e) => get(e, "value"),
					},
					{
						name: "background_id",
						validationType: "number",
						value: get(data, "id", null),
					},
					{
						name: "svg",
						validationType: "string",
						value: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>`,
						// validations: [{ type: "file" }],
					},
					{
						name: "map",
						value:
							get(data, "lat") &&
							get(data, "lon") &&
							`${get(data, "lat")},  ${get(data, "lon")}`,
					},
					{
						name: "lat",
						validationType: "string",
					},
					{
						name: "lon",
						validationType: "string",
					},
				]}
			>
				{({ errors, values, setFieldValue }) => (
					<>
						{console.log(values)}
						<div className="col-lg-6">
							<div className="card-box">
								<h5 className="text-muted card-sub">
									<b>Complex</b>
									<small className="text-muted"> ID {complexID}</small>
								</h5>

								<div className="row g-4">
									<div className="col-12">
										<FastField
											name="name.en"
											component={Fields.Input}
											label={["Name of the Object EN", <span>*</span>]}
											placeholder="Object"
										/>
									</div>

									<div className="col-12">
										<FastField
											name="name.ru"
											component={Fields.Input}
											label={["Name of the Object RU", <span>*</span>]}
											placeholder="Object"
										/>
									</div>

									<div className="col-12">
										<FastField
											name="name.uz"
											component={Fields.Input}
											label={["Name of the Object UZ", <span>*</span>]}
											placeholder="Object"
										/>
									</div>

									<div className="col-12">
										<FastField
											name="svg"
											component={Fields.SvgUpload}
											label="Svg"
											btnText="Upload"
										/>
									</div>
								</div>
							</div>
						</div>

						<div className="col-lg-6">
							<div className="card-box">
								<h5 className="text-muted card-sub">
									<b>Location</b>
								</h5>

								<div className="row g-4">
									<FastField
										name="map"
										component={MapPicker}
										label="Coordinates"
										btnText="Choose on the map"
									/>

									<div className="col-12">
										<FastField
											url="region"
											name="region_id"
											component={Fields.AsyncSelect}
											onValueChange={(option) =>
												setFieldValue("district_id", null)
											}
											optionLabel="name"
											label="Region"
											placeholder="Moscow"
										/>
									</div>

									<div className="col-12">
										<Field
											url="district"
											name="district_id"
											component={Fields.AsyncSelect}
											key={get(values, "region_id.value")}
											isDisabled={
												get(values, "region_id.value") ? false : true
											}
											params={{
												filter: {
													region_id: get(values, "region_id.value", null),
												},
											}}
											optionLabel="name"
											label="District"
											placeholder="Pushkin"
										/>
									</div>

									<div className="col-12">
										<FastField
											name="address.en"
											component={Fields.Input}
											label="Object address EN"
											placeholder="Address"
										/>
									</div>
									<div className="col-12">
										<FastField
											name="address.ru"
											component={Fields.Input}
											label="Object address RU"
											placeholder="Address"
										/>
									</div>
									<div className="col-12">
										<FastField
											name="address.uz"
											component={Fields.Input}
											label="Object address UZ"
											placeholder="Address"
										/>
									</div>
								</div>
							</div>
						</div>

						<div className="bottom-buttons">
							<hr />
							<div className="d-flex align-items-center justify-content-center">
								<Button
									className="btn btn_outlined"
									type="reset"
									innerText="Cancel"
									onClick={() => navigate("/", { replace: true })}
								/>
								<Button className="btn btn_green" type="submit" innerText="Save" />
							</div>
						</div>
					</>
				)}
			</Containers.Form>

			<div className="card-box transparent">
				<h5 className="text-muted card-sub">
					<b>Sections</b>
				</h5>

				<div className="row" style={{ rowGap: "20px" }}>
					<Containers.List
						url="section"
						urlSearchParams={{ filter: { complex_id: complexID } }}
					>
						{({ data }) => {
							return (
								<>
									{Array.isArray(data) &&
										data.map((item, index) => (
											<div
												className="col-lg-3 col-xl-2 col-md-4 col-sm-4 col-6 building-card"
												key={index}
											>
												<SectionCard
													key={index}
													link={"/section/update"}
													complexID={complexID}
													data={item}
													onClick={fetchSection}
												/>
											</div>
										))}
									<div className="col-lg-3 col-xl-2 col-md-4 col-sm-4 col-6 building-card">
										<button
											className="object__add"
											onClick={createSection}
											style={{
												width: "236px",
												height: "197px",
												display: "flex",
												justifyContent: "center",
											}}
										>
											ADD SECTION
										</button>
									</div>
								</>
							);
						}}
					</Containers.List>
				</div>
			</div>

			<SectionForm {...{ modal, section, complexID, type }} />
		</>
	);
};

export default Update;
