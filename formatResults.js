const pb = {
  le: '<:5499lb2g:1274243271706808475>',
  me: '<:2827l2g:1274243344050163735>',
  re: '<:2881lb3g:1274243400836583504>',
  lf: '<:5988lbg:1274243159563571302>',
  mf: '<:3451lg:1274243484433518603>',
  rf: '<:3166lb4g:1274243559176011856>',
};
 
function formatResults(upvotes = [], downvotes = []) {
  const totalVotes = upvotes.length + downvotes.length;
  const progressBarLength = 6;
  const filledSquares = Math.round((upvotes.length / totalVotes) * progressBarLength) || 0;
  const emptySquares = progressBarLength - filledSquares || 0;
 
  if (!filledSquares && !emptySquares) {
    emptySquares = progressBarLength;
  }
 
  const upPercentage = (upvotes.length / totalVotes) * 100 || 0;
  const downPercentage = (downvotes.length / totalVotes) * 100 || 0;
 
  const progressBar =
    (filledSquares ? pb.lf : pb.le) +
    (pb.mf.repeat(filledSquares) + pb.me.repeat(emptySquares)) +
    (filledSquares === progressBarLength ? pb.rf : pb.re);
 
  const results = [];
  results.push(progressBar);
 
  return results.join('\n');
}
 
module.exports = formatResults;