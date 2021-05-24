import * as React from 'react';
import { UncontrolledPopover, PopoverBody, PopoverHeader, Button } from 'reactstrap';
import { Table } from '..';
import { Options } from '@containers/options';
import { TableType } from '../table';
import './index.scss';

export const SceneTakesPopover: React.FunctionComponent = ({
	sceneId,
	target,
	isOpen,
	takes,
	takesTitles,
	addColumnDispatch,
	updateColumnTitleDispatch,
	deleteColumnDispatch,
	fields,
	setFields,
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
				<div>Takes</div>
				<Button
					close
					onClick={e => {
						e.stopPropagation();
						onClose();
					}}
				/>
			</PopoverHeader>
			<PopoverBody>
				<div>
					<Options
						fields={fields}
						setFields={setFields}
						disableSort
						addColumnDispatch={addColumnDispatch}
					/>
					<Table
						type={TableType.SCENE_TAKES}
						fields={fields}
						sceneId={sceneId}
						setFields={setFields}
						updateColumnTitleDispatch={updateColumnTitleDispatch}
						deleteColumnDispatch={deleteColumnDispatch}
						rows={takes || []}
						onChange={onChange}
						onAdd={onAdd}
						onDelete={onDelete}
						onBlur={onBlur}
						titles={takesTitles || {}}
					/>
				</div>
			</PopoverBody>
		</UncontrolledPopover>
	);
};
