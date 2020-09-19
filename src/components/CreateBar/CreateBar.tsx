import * as React from 'react';
import { Button } from 'antd';
import { UserAddOutlined } from '@ant-design/icons';
import { EdgeIcon } from '../../utils/icons';
import styles from './styles.module.sass'
import { Link } from 'react-router-dom';

const CreateBar: React.FC = () => {
  console.log(styles)
  return (
    <div className={styles.createBar}>
      <Link to="/subject">
        <Button icon={<UserAddOutlined />}></Button>
      </Link>
      <Link to="/edge">
        <Button icon={<EdgeIcon />}></Button>
      </Link>
    </div>
  );
};

export default CreateBar;
