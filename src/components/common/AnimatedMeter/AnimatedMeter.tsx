import './AnimatedMeter.scss';

const AnimatedMeter = () => (
  <div id="bars">
    {Array(10).fill(null).map((_, index) => (
      <div key={index} className="bar" />
    ))}
  </div>
);

export default AnimatedMeter;
