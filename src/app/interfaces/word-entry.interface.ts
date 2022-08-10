export interface IWordEntry {
  meta: {
    id: string;
    stems: string[];
  };
  fl: string;
  hwi: {
    hw: string;
    prs: [
      {
        sound: {
          audio: string;
        };
      }
    ];
  };
  shortdef: string[];
}
