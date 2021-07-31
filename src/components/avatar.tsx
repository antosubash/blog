import link from "next/link";

type Props = {
  name: string;
  picture: string;
  link: string;
};

const Avatar = ({ name, picture, link }: Props) => {
  return (
    <div className="flex items-center">
      <img src={picture} className="w-12 h-12 rounded-full mr-4" alt={name} />
      <a href={link}>
        <div className="text-xl font-bold">{name}</div>
      </a>
    </div>
  );
};

export default Avatar;
