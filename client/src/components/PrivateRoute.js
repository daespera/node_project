import React from "react";
import { Route, Redirect } from 'react-router-dom';
import { useToast } from "./Utility/Toast/ToastProvider";

const PrivateRoute = ({ component: Component, ...rest }) => {
	const { addToast } = useToast();
	
	React.useEffect(() => {
		if((document.cookie.match('(^|; )access_token=([^;]*)')||0)[2] == 'undefined' 
	    || (document.cookie.match('(^|; )access_token=([^;]*)')||0)[2] == '')
			addToast('please log in','warning','unauthenticated');
	},[]);

	return(
	  <Route {...rest} render={(props) => (
	    (document.cookie.match('(^|; )access_token=([^;]*)')||0)[2] != 'undefined' 
	    && (document.cookie.match('(^|; )access_token=([^;]*)')||0)[2] != ''
	      ? <Component {...props} />
	      : <Redirect to='/login' />
	  )} />
	)
}

export default PrivateRoute;