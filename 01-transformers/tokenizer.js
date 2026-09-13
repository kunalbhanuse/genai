import { get_encoding } from "tiktoken";

const encodedtokenGpt = get_encoding("cl100k_base");

const encode = encodedtokenGpt.encode("Hi, My Name Is Kunal ?");
// console.log(encode);

const deco = encodedtokenGpt.decode(encode);
// console.log(new TextDecoder().decode(deco));

for (const id of encode) {
  const decodedtext = encodedtokenGpt.decode([id]);
  console.log("decodedtest: - ", decodedtext);
  console.log(new TextDecoder().decode(decodedtext));
}

for (const id of encode) {
  console.log(
    "token as text :-",
    new TextDecoder().decode(encodedtokenGpt.decode([id])),
  );
}
