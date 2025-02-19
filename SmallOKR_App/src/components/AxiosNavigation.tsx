// AxiosNavigation.js
import {useEffect, useContext} from 'react';
import axios from 'axios';
import {UserDispatchContext} from '../state/UserContext';
import {axiosHelper} from '../util/AxiosHelper';

export function useAxiosNavigation() {
  const dispatch = useContext(UserDispatchContext);

  useEffect(() => {
    const intercetpor = axiosHelper.instance.interceptors.response.use(
      response => response,
      error => {
        switch (error?.response?.status) {
          case 401:
            dispatch({type: 'Logout'});
            break;
          default:
        }
        return Promise.reject(error);
      },
    );

    return () => {
      axios.interceptors.response.eject(intercetpor);
    };
  }, []);
}

export default function AxiosNavigation() {
  useAxiosNavigation();
  return <></>;
}
