import { useNavigation } from '@react-navigation/native';
import { removeToken } from '../utils/storage';

const ProfileScreen = () => {
  const navigation = useNavigation<any>();

  const handleLogout = async () => {
    await removeToken();
    // Reset navigation stack to prevent going back
    navigation.reset({
      index: 0,
      routes: [{ name: 'Auth' }],
    });
  };

  return <div>Profile Screen</div>;
};


export default ProfileScreen;