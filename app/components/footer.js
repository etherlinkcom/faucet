import React from "react";
import Link from "next/link";
import Image from "next/image";
import Container from "./container";

import { X, Discord, Telegram, GitHub } from "./icons";

export default function Footer() {
  const navigation = [
    { name: "Spotlight", link: "https://spotlight.tezos.com" },
    { name: "Documentation", link: "https://docs.etherlink.com" },
    {
      name: "Brand Assets",
      link: " https://drive.google.com/file/d/1ifYTZvutM868URwf1xRZviFrV0rS9glE/view?usp=sharing",
    },
  ];
  return (
    <div className="relative">
      <Container>
        <div className="grid max-w-screen-xl grid-cols-1 gap-10 pt-10 mx-auto mt-5 border-trueGray-700 lg:grid-cols-5">
          <div className="lg:col-span-2 flex flex-col sm:flex-row justify-between align-center">
            <div>
              <Link
                href="/"
                className="flex items-center space-x-2 text-2xl font-medium  text-gray-100"
              >
                <Image
                  src="/img/home/logo_beta_full.png"
                  alt="N"
                  width={512}
                  height={512}
                  className="w-32"
                />
                {/* <span>Etherlink</span> */}
              </Link>
            </div>

            <a
              href="https://tezos.com"
              target="_blank"
              rel="noopener"
              className="relative block w-44 mt-4 sm:mt-0"
            >
              Powered by
              <Image
                src="/img/home/tezos.png"
                alt="Powered by Tezos"
                width={106}
                height={22}
              />
            </a>
          </div>

          <div>
            <div className="flex flex-wrap w-full -mt-2 -ml-3 lg:ml-0">
              {navigation.map((item, index) => (
                <Link
                  key={index}
                  href={item.link}
                  className="w-full px-4 py-2 rounded-md text-gray-300 hover:text-neonGreen"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
          <div>
            {/* <div className="flex flex-wrap w-full -mt-2 -ml-3 lg:ml-0">
              {legal.map((item, index) => (
                <Link key={index} href={item.link} className="w-full px-4 py-2 rounded-md text-gray-300 hover:text-darkGreen" target="_blank" rel="noopener noreferrer">
                  {item.name}
                </Link>
              ))}
            </div> */}
          </div>
          <div className="">
            <div>Join the Community</div>
            <div className="flex mt-5 text-gray-500 items-center">
              <a href="https://x.com/etherlink" target="_blank" rel="noopener">
                <span className="sr-only">X</span>
                <X size={40} />
              </a>
              <a
                href="https://discord.gg/etherlink"
                target="_blank"
                rel="noopener"
              >
                <span className="sr-only">Discord</span>
                <Discord size={40} />
              </a>
              <a
                href="https://t.me/etherlinkcom"
                target="_blank"
                rel="noopener"
              >
                <span className="sr-only">Telegram</span>
                <Telegram size={40} />
              </a>
              <a
                href="https://github.com/etherlinkcom"
                target="_blank"
                rel="noopener"
                className="mb-1"
              >
                <span className="sr-only">GitHub</span>
                <GitHub size={40} />
              </a>
              {/* <a
                href="mailto:reachout@etherlink.com"
                target="_blank"
                rel="noopener">
                <span className="sr-only">Reach out</span>
                <Email />
              </a> */}
            </div>
          </div>
        </div>

        <div className="my-10 text-sm text-center text-gray-400">
          © Copyright Tezos Foundation {new Date().getFullYear()}. All Rights
          Reserved.
        </div>
      </Container>
    </div>
  );
}
