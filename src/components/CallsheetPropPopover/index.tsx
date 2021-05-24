import * as React from 'react';
import { UncontrolledPopover, PopoverBody, PopoverHeader, Button } from 'reactstrap';
import { Table } from '..';
import { TableType } from '../table';
import './index.scss';

export const CallsheetPropPopover: React.FunctionComponent = ({
	target,
	isOpen,
	prop,
	onChange,
	onAdd,
	onDelete,
	onClose,
	onBlur,
}) => {
	return (
		<UncontrolledPopover
			target={target}
			placement="bottom"
			isOpen={isOpen}
			trigger="click"
			className="callsheet-tag-popover"
		>
			<PopoverHeader className="callsheet-tag-popover__header">
				<div>Item info</div>
				<Button
					close
					onClick={e => {
						e.stopPropagation();
						onClose();
					}}
				/>
			</PopoverHeader>
			<PopoverBody>
				<Table
					type={TableType.CALLSHEET_ITEM}
					fields={['box_description', 'box_number', 'storage_location', 'comments']}
					rows={prop.info || []}
					title={'test'}
					onChange={onChange}
					onAdd={onAdd}
					onDelete={onDelete}
					onBlur={onBlur}
				/>
			</PopoverBody>
		</UncontrolledPopover>
	);
};
