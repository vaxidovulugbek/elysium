import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { get } from "lodash";

import Containers from "containers";
import { AddObject, Breadcrumb, Fields, FloorCard, ModalRoot, Modals } from "components";
import { deletePermission } from "components/Modal/DeletePermission/DeletePermission";
import { SectionCard } from "../components/SectionCard";
import { useDelete, useFetchList, useOverlay } from "hooks";

const List = () => {
	const modal = useOverlay("modal");
	const navigate = useNavigate();

	const { sectionID, complexID } = useParams();

	const floorList = useFetchList({
		url: "floor",
		urlSearchParams: {
			include: "file",
			filter: { section_id: sectionID },
		},
	});

	const { mutate } = useDelete({
		url: "floor",
		queryOptions: {
			onSuccess: () => {
				floorList.refetch();
			},
		},
	});

	const onDelete = (id) => {
		const receivePermission = () => {
			mutate(id);
		};
		deletePermission({
			title: "Delete a Floor?",
			icon: "error",
			text: "All data concerning this floor will be deleted.",
			receivePermission,
		});
	};

	return (
		<>
			<div className="container-fluid section__update">
				<div className="mb-4">
					<h1 className="page-title">Section {sectionID}</h1>
					<Breadcrumb
						links={[
							{
								name: "Control Panel",
								url: "/",
							},
							{
								name: "Complex",
								url: "/",
							},
							{
								name: "My complex",
								url: `/complex/update/${complexID}`,
							},
							{
								name: "Floor",
								url: "/",
							},
						]}
					/>
				</div>

				<div className="row">
					<div className="col-lg-6">
						<div className="card-box transparent">
							<h5 className="text-muted card-sub">
								<b>Floor Plans</b>
							</h5>

							<div className="row section-list">
								<Containers.List
									url="floor"
									urlSearchParams={{
										include: "file",
										filter: { section_id: sectionID },
									}}
								>
									{({ data }) => {
										if (!data) return "";
										return data?.map((item) => (
											<FloorCard
												onDelete={onDelete}
												onClick={() =>
													navigate(
														`/complex/${complexID}/section/${sectionID}/floor/${get(
															item,
															"id"
														)}/update`
													)
												}
												key={item.id}
												item={item}
												link={`/complex/${complexID}/section/${sectionID}/floor/${get(
													item,
													"id"
												)}/apartment`}
											/>
										));
									}}
								</Containers.List>

								<div className="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 building-card">
									<AddObject
										onClick={() => {
											navigate(
												`/complex/${complexID}/section/${sectionID}/floor/create`
											);
										}}
										src={require("assets/images/section-img1.png")}
										innerText="ADD A FLOOR PLAN"
										className={"p-3"}
									/>
								</div>
							</div>
						</div>
					</div>

					<div className="col-lg-6">
						<div className="card-box transparent">
							<h5 className="text-muted card-sub">
								<b>Layout of accomodations</b>
							</h5>

							<div className="row g-4">
								{new Array(5).fill(1).map((el, index) => (
									<div
										className="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 building-card"
										key={index}
									>
										<SectionCard />
									</div>
								))}

								<div className="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 building-card">
									<AddObject
										onClick={modal.handleOverlayOpen}
										src={require("assets/images/layout-add.jpg")}
										innerText="ADD A LAYOUT"
									/>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			<ModalRoot isOpen={modal.isOpen} style={{ maxWidth: "500px" }}>
				<Modals.AddObject
					onClose={modal.handleOverlayClose}
					title={"Adding a layout"}
					fields={[
						{
							name: "name",
							component: Fields.Input,
							label: ["Layout name", <span>*</span>],
							placeholder: "1A",
						},
					]}
				/>
			</ModalRoot>
		</>
	);
};

export default List;
