import * as React from 'react';
import { UserInterface } from '@src/containers/user/interfaces';
import Avatar from "@vuexy/avatar/AvatarComponent"
import { connect } from 'react-redux';
import { compose } from 'redux';

interface UserAvatarProps {
	userInfo: UserInterface;
}

const UserAvatar: React.FC<UserAvatarProps> = (props: UserAvatarProps) => {
	const {userInfo} = props;
	return (
		<Avatar className="mr-1" size='md' img={userInfo.profileImage} />
	);
}

const mapStateToProps = (state: {user: UserInterface}) => {
	return {
		userInfo: state.user
	};
};

export default compose(connect(mapStateToProps)(UserAvatar));
