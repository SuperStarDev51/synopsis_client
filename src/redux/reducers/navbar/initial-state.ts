import { searchResult } from "../../../@fake-db/navbar/navbarBookmarkSearch"


const defaultStarred = searchResult.filter(item => {
    return item.starred === true
  })
  
 export const navbarInitialState = {
    suggestions: [],
    isLoading: false,
    value: "",
    starred: defaultStarred,
    noSuggestions: false,
    extraStarred: []
  }