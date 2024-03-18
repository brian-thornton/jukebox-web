import styles from  './AnimatedMeter.module.css';

const AnimatedMeter = () => (
  <div id="bars">
    {Array(10).fill(null).map((_, index) => (
      <div key={index} className={styles.bar} />
    ))}
  </div>
);

export default AnimatedMeter;
