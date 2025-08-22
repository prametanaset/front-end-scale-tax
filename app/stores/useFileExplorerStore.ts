import { defineStore } from "pinia";

export const useFileExplorerStore = defineStore("fileExplorer", () => {
  const searchQuery = ref("");
  const canDownload = ref(false);
  const selectFilesCount = ref(0);
  const showView = ref("list" as "grid" | "list");

  function setSearchQuery(q: string) {
    searchQuery.value = q;
  }

  function setCanDownload(v: boolean) {
    canDownload.value = v;
  }

  function setShowView(v: "grid" | "list") {
    showView.value = v;
  }

  function setSelectFilesCount(v: number) {
    selectFilesCount.value = v;
  }

  return {
    searchQuery,
    canDownload,
    showView,
    selectFilesCount,
    setSearchQuery,
    setCanDownload,
    setShowView,
    setSelectFilesCount,
  };
});
