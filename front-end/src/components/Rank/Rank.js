import React from "react"

const Rank =({name,entires}) =>{
    return (
        <div>
            <div className="white f3">
                {`${name} your current entry count is .......`}
            </div>
            <div className="white f1">
                {entires}
            </div>
        </div>
    );
}
export default Rank;