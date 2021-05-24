import * as React from 'react';
import { RootStore } from '@src/store';
import { useSelector, useDispatch } from 'react-redux';
import { useIntl, FormattedMessage } from "react-intl"
import classnames from "classnames"
import {
	Button,
	Modal,
	ModalBody,
	ModalFooter,
	Input,
} from "reactstrap"
import { sendInvitation } from "@containers/register/initial-state";
import {Spinner} from "reactstrap/lib/Spinner";

interface Props {
	readonly isOpen: boolean;
	readonly toogle: (b:boolean) => void;
}

export const InviteUser: React.FunctionComponent<Readonly<Props>> = (props: Readonly<Props>) => {
	const dispatch = useDispatch();
	const { formatMessage } = useIntl();
	const { isOpen, toogle } = props;
	const state = useSelector((state: RootStore) => state);
	const user = state.user;
	const events = useSelector((state: RootStore) => state.events)
	const activeEvent = events.filter((event: Event) => event.preview)[0];
	const [invitingUserEmail, setInvitingUserEmail] = React.useState('');
	const [loading, setLoading] = React.useState(false);
	const [loaded, setLoaded] = React.useState(false);

	return (
		<Modal
			isOpen={isOpen}
			toggle={()=>toogle(false)}
			className="modal-dialog-centered modal-md"
		>
			{loaded
				? <div className="p-4 text-success text-center">INVITATION HAS BEEN SENT!</div>
				: (
					<>
					<ModalBody className="mx-3 my-1">
						<Input
							className=""
							type="email"
							placeholder="Email of the user you want to invite"
							value={invitingUserEmail}
							onChange={(e) => setInvitingUserEmail(e.target.value)}
						/>
					</ModalBody>
					<ModalFooter className="justify-content-center py-2">
						<Button color="yellow"
								className={classnames("width-200", {
									"opacity-05": loading
								})}
								onClick={async () => {
									setLoading(true);
									let invitation = await sendInvitation(user.id, activeEvent.id, invitingUserEmail);
									if (invitation) {
										setLoading(false);
										setLoaded(true);
										setTimeout(() => {
											toogle(false);
											setInvitingUserEmail('');
											setLoaded(false);
										}, 700)
									}
								}}
						>
							{loading
								? <span>SENDING...</span>
								: <FormattedMessage id='send_invitation'/>
							}
						</Button>
					</ModalFooter>
					</>
				)
			}
		</Modal>
	)
};
