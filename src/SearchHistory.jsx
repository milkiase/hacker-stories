const SearchHistory = ({searchHistory, onHistoryClicked})=>{
    return (
        <div className="ml-2 flex pt-3 max-[348px]:text-xs">
            {searchHistory.map((term, index)=><button className=" text-blue-500 mr-2  h-3 align-bottom" 
                onClick={onHistoryClicked} key={term + index} value={term}>{term} <i className="text-gray-500">|</i></button>)}
            {searchHistory.length == 5 && <p>...</p>}
        </div>
    );
}
export default SearchHistory;
