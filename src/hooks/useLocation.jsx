import { useSelector} from 'react-redux';
const useLocation = () => {

    const loaction = useSelector((state) => state.realestate.locations);
    return {
        loaction
    };
};

export default useLocation;
