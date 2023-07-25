import InputWithText from "./InputWithText";
import BaseBtn from "./BaseBtn";
const SearchForm = ({onSearchSubmit, onSearchInput, searchTerm})=>{
    return (
      <form onSubmit={onSearchSubmit} className='flex'>
        <InputWithText id='search'  onValueChange={onSearchInput} value={searchTerm} autoFocus>
          <strong>Search :</strong>
        </InputWithText>
        <BaseBtn type='submit' disabled={!searchTerm}
          classValue=' bg-teal-600 text-white rounded-sm ml-3 px-2 py-1 max-[405px]:mt-6 mr-10 md:mr-0'>Submit</BaseBtn>
      </form>
    );
  }

export default SearchForm