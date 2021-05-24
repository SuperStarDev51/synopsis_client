import * as React from 'react';
import SVG from 'react-inlinesvg';
import { useIntl } from "react-intl"
import { Popup } from '@components';

import './index.scss';

interface Props {
	readonly description: string;
	readonly label: string;
	readonly date: string;
	readonly id: string;
	readonly listId: string;
	readonly provided: any;
	readonly innerRef: any;
	readonly onDateClick: () => void;
	readonly onDelete: (card: string, list: string) => void;
	readonly onTypeClick: (card: string, list: string) => void;
	readonly onDescriptionChange: (value: string, cardId: string, listId: string) => void;
}

export const Card: React.FC<Props> = (props: Props): any => {
	const { formatMessage } = useIntl();
	const inputRef: React.MutableRefObject<any> = React.useRef(null);
	const {
		id,
		label,
		date,
		listId,
		provided,
		onDelete,
		innerRef,
		onDateClick,
		onTypeClick,
		description,
		onDescriptionChange
	} = props;

	const [isOpen, setIsOpen] = React.useState(false);
	const [isOptionsPopOpen, setIsOptionsPopOpen] = React.useState(false);

	React.useEffect(() => {
		if (!description) {
			inputRef.current.focus();
		}
	}, []);

	return (
		<div className="c-card" {...provided.draggableProps} {...provided.dragHandleProps} ref={innerRef}>
			<div className="c-card__body">
				<div className="c-card__description">
					<input
						type="text"
						ref={inputRef}
						placeholder="Add a description..."
						value={description}
						onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
							onDescriptionChange(e.target.value, id, listId)
						}
					/>
				</div>
			</div>

			<div className="c-card__footer">
				<span className="c-card__label">{label}</span>

				<span className="c-card__date">
					<SVG src="/assets/images/time-icon.svg" />
					{date}
				</span>

				<button
					onClick={(): void => setIsOpen(!isOpen)}
					className="c-card__button c-btn-add-more"
					type="button"
				>
					<SVG src="/assets/images/add_circle-gray.svg" />
				</button>
			</div>

			<Popup
				onClick={(): void => setIsOpen(!isOpen)}
				onOutsideClick={(): void => setIsOpen(false)}
				isOpen={isOpen}
				options={[
					{
						disabled: false,
						text: formatMessage({id: 'due_date'}),
						action: (): void => {
							onDateClick();
							setIsOpen(!isOpen);
						}
					},
					{
						disabled:false,
						text: formatMessage({id: 'type'}),
						action: (): void => {
							onTypeClick(id, listId);
							setIsOptionsPopOpen(!isOptionsPopOpen);
							setIsOpen(!isOpen);
						}
					},
					{
						disabled: false,
						text: formatMessage({id: 'delete'}),
						action: (): void => {
							onDelete(id, listId);
							setIsOpen(!isOpen);
						}
					}
				]}
			/>

			<Popup
				isOpen={isOptionsPopOpen}
				onClick={(): void => {
					return;
				}}
				onOutsideClick={(): void => setIsOptionsPopOpen(false)}
				options={[
					{
						text: 'Type 1',
						action: (): void => {
							setIsOptionsPopOpen(!isOptionsPopOpen);
						}
					},
					{
						text: 'Type 2',
						action: (): void => {
							setIsOptionsPopOpen(!isOptionsPopOpen);
						}
					},
					{
						text: 'Type 3',
						action: (): void => {
							setIsOptionsPopOpen(!isOptionsPopOpen);
						}
					}
				]}
			/>
		</div>
	);
};

export default Card;
