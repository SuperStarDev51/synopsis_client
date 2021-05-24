import * as React from 'react';
import SVG from 'react-inlinesvg';
import { FormattedMessage, } from "react-intl"
import './index.scss';

interface Props {
	readonly children: any;
	readonly listTitle?: string;
	readonly stripeColor: string;
	readonly id: string;
	readonly innerRef: any;
	readonly provided: any;
	readonly onTitleChange: (title: string, id: string) => void;
	readonly onDelete: (id: string) => void;
	readonly onAddTask: (id: string) => void;
	readonly placeholder?: string;
}

export const List: React.FC<Props> = (props: Props) => {
	const inputRef: React.MutableRefObject<any> = React.useRef(null);
	const {
		children,
		stripeColor,
		listTitle,
		id,
		onTitleChange,
		onDelete,
		onAddTask,
		innerRef,
		provided,
		placeholder
	} = props;

	React.useEffect(() => {
		if (!listTitle) {
			inputRef.current.focus();
		}
	}, []);

	return (
		<div className="c-list" {...provided.droppableProps} ref={innerRef}>
			<div className="c-list__color" style={{ backgroundColor: stripeColor }}></div>

			<header className="c-list__title">
				<input
					type="text"
					value={listTitle}
					ref={inputRef}
					placeholder={placeholder}
					onChange={(e: React.ChangeEvent<HTMLInputElement>): void => onTitleChange(e.target.value, id)}
				/>

				<button onClick={(): void => onDelete(id)} className="c-btn-add-more c-btn-close" type="button">
					<SVG src="/assets/images/add_circle-gray.svg" />
				</button>
			</header>

			{children}

			<button className="c-btn-with-text-and-icon" onClick={(): void => onAddTask(id)}>
					<FormattedMessage id='add_task'/>
				<SVG src="/assets/images/add_circle-gray.svg" />
			</button>
		</div>
	);
};

export default List;
