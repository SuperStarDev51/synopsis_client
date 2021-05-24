import * as React from 'react';
import { useDispatch } from 'react-redux';
import { useIntl } from 'react-intl';
import { NewCell } from '@components';
import { InputGroup } from 'reactstrap';
import { XCircle } from 'react-feather';

interface Props {
	readonly data: any;
	readonly color: string;
	readonly index: number;
	readonly onChange: (value: any, id: string | number, field: string) => void;
	readonly onBlur: (value: any, id: string | number, field: string) => void;
	readonly onDelete: (id: number | string) => void;
	readonly fields: any;
}

export const CallsheetItemRow: React.FunctionComponent<Props> = (props: Props) => {
	const inputRef = React.useRef(null);
	const { formatMessage } = useIntl();
	const dispatch = useDispatch();
	const { data, index, fields, onChange, onBlur } = props;

	return (
		<div className="n-row position-relative d-flex mb-02">
			<span className="n-row__color" style={{ backgroundColor: props.color }} />
			{fields.map((field: string, field_index: number) => (
				<InputGroup key={field_index} style={{ flexWrap: 'unset' }}>
					<>
						<NewCell
							id={index}
							key={field_index}
							type="string"
							field={field}
							value={(data as any)[field]}
							field={field}
							onChange={(value: any) => onChange(value, index, field)}
							onBlur={(value: any) => onBlur(value, index, field)}
							inputRef={index === 0 ? inputRef : null}
							isReadOnly={false}
							classnames={['width-10-rem']}
							invalid={false}
						></NewCell>
					</>
				</InputGroup>
			))}
			<div className="fonticon-container">
				<div className="fonticon-wrap width-0 height-auto">
					<XCircle
						className="n-btn-delete mr-1 mb-1"
						size={20}
						onClick={(): void => props.onDelete(props.index)}
					/>
				</div>
			</div>
		</div>
	);
};

export default CallsheetItemRow;
