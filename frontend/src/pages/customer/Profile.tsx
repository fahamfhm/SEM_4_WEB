import React from "react";
import styles from "../../styles/Profile.module.css";

// Example static data, replace with real data or props/context
const customer = {
  name: "John Doe",
  email: "john.doe@example.com",
  phone: "+1 234 567 8901",
  address: "123 Main St, Springfield, USA",
  joined: "2024-01-15",
};

const CustomerProfile: React.FC = () => {
  return (
    <div className={styles["profile-page-center"]}>
      <div className={styles["profile-container"]}>
        <div className={styles["profile-header"]}>
          <h2>Profile</h2>
          <p>View your account details</p>
        </div>
        <div className={styles["profile-details"]}>
          <div className={styles["profile-field"]}>
            <span className={styles["profile-label"]}>Name</span>
            <span className={styles["profile-value"]}>{customer.name}</span>
          </div>
          <div className={styles["profile-field"]}>
            <span className={styles["profile-label"]}>Email</span>
            <span className={styles["profile-value"]}>{customer.email}</span>
          </div>
          <div className={styles["profile-field"]}>
            <span className={styles["profile-label"]}>Phone</span>
            <span className={styles["profile-value"]}>{customer.phone}</span>
          </div>
          <div className={styles["profile-field"]}>
            <span className={styles["profile-label"]}>Address</span>
            <span className={styles["profile-value"]}>{customer.address}</span>
          </div>
          <div className={styles["profile-field"]}>
            <span className={styles["profile-label"]}>Joined</span>
            <span className={styles["profile-value"]}>{customer.joined}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerProfile;
