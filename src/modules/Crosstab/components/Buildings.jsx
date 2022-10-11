/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef } from "react";

import { get } from "lodash";
import { find } from "lodash";

export const Buildings = ({
	setCurrentStep,
	setActivePathID,
	activePathID,
	step,
	setActiveApartment,
	stepUrls = [],
	data,
}) => {
	const svgWrap = useRef();

	const stringSvg = get(data, "vector");

	useEffect(() => {
		if (svgWrap.current) {
			stringSvg ? (svgWrap.current.innerHTML = stringSvg) : (svgWrap.current.innerHTML = "");
			const paths = svgWrap.current.querySelectorAll("path");

			paths?.forEach((path) => {
				// check for appartment and set color by status
				const appartmentID = path.getAttribute("data-apartment-id");
				const appartment = find(get(data, "apartments"), {
					id: Number(appartmentID),
				});
				if (appartmentID) {
					// status colors in the _crosstab-layout.scss file
					path.classList.add(`status-${get(appartment, "status")}`);
				}
				path?.addEventListener("click", (e) => {
					// get id from path tag
					const pathID = path.getAttribute(`data-${stepUrls[step]}-id`);

					if ((pathID, step < 3)) {
						const PathsId = activePathID;
						PathsId[step] = pathID;
						setActivePathID(PathsId);

						setCurrentStep(step + 1);
					} else if (step === 3) {
						// open right side appartment information
						setActiveApartment(appartment);
					}
				});
			});
		}
	}, [data, svgWrap, stringSvg]);
	return <div className="buildings" ref={svgWrap}></div>;
};
