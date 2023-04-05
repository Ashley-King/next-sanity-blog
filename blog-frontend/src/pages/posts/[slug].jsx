import client from "../../../client";
import groq from "groq";
import imageUrlBuilder from "@sanity/image-url";
import {PortableText} from "@portabletext/react";

const urlFor = (source) => {
  console.log("source", source)
  return imageUrlBuilder(client).image(source);
}

const ptComponents = {
  types: {
    image: ({value}) => {
      console.log("value", value)
      if(!value?.asset?._ref) {
        console.log("Missing asset reference", value)
        return null;
      };
      return(
        <img
        alt={value.alt || ""}
        loading="lazy"
        src={urlFor(value.asset._ref).width(800).height(240).fit('max').auto('format')}
        />
      )
    }
  }
}

const query = groq`*[_type == "post" && slug.current == $slug][0]{
  title,
  "name": author->name,
  "categories": categories[]->title,
  "authorImage": author->image,
  body
  }`


export async function getStaticPaths() {
  const paths = await client.fetch(`*[_type == "post" && defined(slug.current)].slug.current`);
  return {
    paths: paths.map((slug) => ({ params: { slug } })),
    fallback: true,
  };

}


export async function getStaticProps(context) {
  const { slug = "" } = context.params;
  const post = await client.fetch(
    query,
    { slug }
  );
  return {
    props: {
      post,
    },
  };
}

const Post = (props) => {
  const {title = "Missing title", name = "Missing name", categories,
authorImage, body = []} = props.post;
console.log("props", props)
  return(
    <article>
      <h1>{title}</h1>
      <span>By: {name}</span>
      {categories && (
        <ul>
        Post in:
          {categories.map((category) => (
            <li key={category}>{category}</li>
          ))}
        </ul>
      )}
      {authorImage && (
        <div>
          <img
          src={urlFor(authorImage).width(50).url()}
          alt={name}
          />
        </div>
      )}
      <PortableText
      value={body}
      components={ptComponents}
      />
      </article>
  )
}

export default Post;