import * as React from 'react';
import { useIntl } from "react-intl"
import Popup from '@src/components/popup';
import SVG from 'react-inlinesvg';
import { Wrapper } from '@components';
import * as FolderIcon from '@assets//images/folder-icon.svg';

const filesItems = [
	{
		rowTitle: 'SUPPLIERS',
		isPopupVisible: false,
		rows: [
			{
				title: 'supplier name'
			},
			{
				title: 'supplier name'
			},
			{
				title: 'supplier name'
			},
			{
				title: 'supplier name'
			},
			{
				title: 'supplier name'
			},
			{
				title: 'supplier name'
			},
			{
				title: 'supplier name'
			},
			{
				title: 'supplier name'
			}
		]
	},

	{
		rowTitle: 'ARTISTS',
		isPopupVisible: false,
		rows: [
			{
				title: 'artists name'
			},
			{
				title: 'artists name'
			},
			{
				title: 'artists name'
			},
			{
				title: 'artists name'
			}
		]
	},

	{
		rowTitle: 'MARKETING',
		isPopupVisible: false,
		rows: [
			{
				title: 'PR'
			},
			{
				title: 'FB'
			},
			{
				title: 'Design'
			}
		]
	},

	{
		rowTitle: 'GENERAL',
		isPopupVisible: false,
		rows: [
			{
				title: 'Police'
			},
			{
				title: 'Legal'
			},
			{
				title: 'Local Authority'
			},
			{
				title: 'Performance ideas'
			},
			{
				title: 'Design'
			}
		]
	}
];

export const Files: React.FunctionComponent = () => {
	const { formatMessage } = useIntl();
	const [filesData, setFilesData] = React.useState(filesItems);
	const togglePopup = (index: number): void => {
		const newItems = [...filesData];
		filesData.map((data, idx: number) => {
			if (idx !== index) {
				data.isPopupVisible = false;
				return data;
			} else if (idx === index && data.isPopupVisible) {
				data.isPopupVisible = false;
				return data;
			}

			newItems[index].isPopupVisible = true;
			return newItems;
		});
		setFilesData(newItems);
	};

	return (
		<Wrapper className="o-wrapper--files">
			<div className="c-content c-content--files">
				<div className="c-files">
					{filesData.map((filesRow, index: number) => {
						return (
							<div className="c-files__row" key={index}>
								{filesRow.isPopupVisible && (
									<Popup
										onAddField={() => {}}
										isOpen={filesData[index].isPopupVisible}
										onClick={(): void => {
											return;
										}}
										onOutsideClick={(): void => togglePopup(index)}
										options={[
											{
												disabled: false,
												text: formatMessage({id: 'add_new'}),
												action: (): void => {
													togglePopup(index);
												}
											},
											{
												disabled: false,
												text: formatMessage({id: 'delete'}),
												action: (): void => {
													togglePopup(index);
												}
											}
										]}
										className="c-popup--files"
									/>
								)}

								<div
									key={index}
									onClick={(): void => {
										togglePopup(index);
									}}
									className={`c-files__row-header${
										filesData[index].isPopupVisible ? ' popup-open' : ''
									}`}
								>
									{filesRow.rowTitle}
								</div>

								<div className="c-files__row-body">
									{filesRow.rows?.map((item: any, id: number) => {
										return (
											<div key={id} className="c-files__row-item">
												<SVG src={FolderIcon as any} />
												{item.title}
											</div>
										);
									})}
								</div>
							</div>
						);
					})}
				</div>
			</div>
		</Wrapper>
	);
};

export default Files;
