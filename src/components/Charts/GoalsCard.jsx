import React from "react";

const GoalsCard = ({ title, value }) => (
  <div className="bg-white shadow rounded-2xl p-4 text-center">
    <h3 className="text-lg font-semibold">{title}</h3>
    <p className="text-2xl font-bold mt-2">{value}</p>
  </div>
);

export default GoalsCard;
