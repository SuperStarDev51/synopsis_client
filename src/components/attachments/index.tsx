import * as React from 'react';
import { SwipeableDrawer } from '@material-ui/core';
import './index.scss';
import { useOutsideClick } from '@src/utilities';
import { Attachment } from './interfaces'
import { XCircle} from "react-feather"

interface Option {
	readonly text: string;
	readonly disabled: boolean;
	readonly action: () => void;
}

interface Props {
	readonly isOpen: boolean;
	readonly attachments: Attachment[];
	readonly onChange: (f: File) => void;
	readonly onFileDelete: (f: File) => void;
	readonly setIsAttachmentsOpen: (bool: boolean) => void;
	readonly onOutsideClick: () => void;
}

export const Attachments: React.FC<Props> = (props: Props) => {
	const { attachments, setIsAttachmentsOpen } = props
	const ref: React.MutableRefObject<any> = React.useRef(null);
	const { isOpen, onOutsideClick, onChange, onFileDelete } = props;
	const [newFieldValue, setNewFieldValue] = React.useState<string>('');
	const [file, setFile] =  React.useState<any>(undefined);

	/* eslint-disable @typescript-eslint/no-non-null-assertion */
	useOutsideClick(ref, onOutsideClick!);


	return isOpen ? (
		<div>
		<SwipeableDrawer
			anchor={'right'}
			open={isOpen}
			onOpen={()=>setIsAttachmentsOpen(true)}
			onClose={onOutsideClick}
		>
			<>
			{attachments.map((a: any, i: number)=>(
				<div>
					<img src={a.file_url} style={{'width': 50}} alt=""/>
					<h5 key={i}>{a.file_name}</h5>
					<XCircle
						className="n-btn-delete mr-1 mb-1"
						size={20}
						onClick={(): void => onFileDelete(a.file_id, a.file_name)}
					/>
				</div>
			))}
				<input
					onChange={(event: React.ChangeEvent<HTMLInputElement>): void => {
						setNewFieldValue(event.target.value);
						if(event.target.files){setFile(event.target.files[0])}
					}}
					type="file"
					multiple
					value={newFieldValue}
					placeholder="Add new..."
				/>
				<button onClick={()=>{onChange(file); setNewFieldValue('')}}>upload</button>
			</>
			</SwipeableDrawer>
			</div>
	) : null
};

export default Attachments;
