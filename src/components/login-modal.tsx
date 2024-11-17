import { CustomFlowbiteTheme, Modal } from "flowbite-react";
import { useEffect } from "react";
import { useMutation } from "react-query";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "./input";
import { Loading } from "./loading";

const loginFormSchema = z.object({
  email: z.string().email("Email inválido").min(1, "Campo obrigatório"),
  password: z.string().min(1, "Campo obrigatório"),
});

type LoginFormSchema = z.infer<typeof loginFormSchema>;

const customTheme: CustomFlowbiteTheme["modal"] = {
  root: {
    base: "fixed inset-x-0 top-0 z-50 h-screen overflow-y-auto overflow-x-hidden md:inset-0 md:h-full",
    show: {
      on: "flex bg-neutral-950 bg-opacity-80",
      off: "hidden",
    },
    sizes: {
      sm: "max-w-sm",
      md: "max-w-md",
      lg: "max-w-lg",
      xl: "max-w-xl",
      "2xl": "max-w-2xl",
      "3xl": "max-w-3xl",
      "4xl": "max-w-4xl",
      "5xl": "max-w-5xl",
      "6xl": "max-w-6xl",
      "7xl": "max-w-7xl",
    },
    positions: {
      "top-left": "items-start justify-start",
      "top-center": "items-start justify-center",
      "top-right": "items-start justify-end",
      "center-left": "items-center justify-start",
      center: "items-center justify-center",
      "center-right": "items-center justify-end",
      "bottom-right": "items-end justify-end",
      "bottom-center": "items-end justify-center",
      "bottom-left": "items-end justify-start",
    },
  },
  content: {
    base: "relative h-full w-full p-4 md:h-auto",
    inner: "relative flex flex-col rounded-lg bg-neutral-900 shadow",
  },
  body: {
    base: "flex-1 overflow-auto p-6",
    popup: "pt-0",
  },
  header: {
    base: "flex items-start justify-between rounded-t border-b p-5 border-gray-600",
    popup: "border-b-0 p-2",
    title: "text-xl font-medium text-gray-900 text-neutral-200",
    close: {
      base: "ml-auto inline-flex items-center rounded-lg bg-transparent p-1.5 text-sm text-gray-400 hover:bg-neutral-600 hover:text-neutral-200",
      icon: "h-5 w-5",
    },
  },
  footer: {
    base: "flex items-center space-x-2 border-gray-600 p-6 pt-0",
    popup: "border-t",
  },
};

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (email: string, password: string) => Promise<void>;
  openSignUpModal: () => void;
}

export function LoginModal({
  isOpen,
  onClose,
  onSubmit,
  openSignUpModal,
}: LoginModalProps) {
  const mutation = useMutation({
    mutationFn: async (data: { email: string; password: string }) =>
      await onSubmit(data.email, data.password),
  });
  const {
    handleSubmit,
    reset,
    formState: { errors },
    register,
  } = useForm<LoginFormSchema>({
    resolver: zodResolver(loginFormSchema),
  });

  useEffect(() => reset(), [isOpen, reset]);

  return (
    <Modal
      show={isOpen}
      size="lg"
      onClose={() => onClose()}
      popup
      theme={customTheme}
    >
      <Modal.Header>
        <h3 className="p-1.5 pl-4 text-base text-neutral-200">
          Acesse ou cadastre-se
        </h3>
      </Modal.Header>
      <form onSubmit={handleSubmit((data) => mutation.mutate(data))}>
        <Modal.Body className="">
          <div className="w-full flex flex-col items-center justify-start gap-4">
            <div className="w-full flex flex-col items-center justify-start gap-4">
              <Input
                error={errors.email?.message}
                id="email"
                label="Email"
                placeholder="Email"
                {...register("email")}
              />
              <Input
                error={errors.password?.message}
                id="password"
                label="Senha"
                placeholder="Senha"
                type="password"
                {...register("password")}
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer className="gap-4 flex flex-col items-center">
          <button
            className="w-full rounded-md hover:brightness-75 transition-all bg-lime-500 text-base p-2.5 text-neutral-900"
            type="submit"
          >
            {mutation.isLoading ? (
              <Loading color="neutral-dark" size="xs" />
            ) : (
              "Entrar"
            )}
          </button>
          <p className="text-sm text-neutral-200">
            Ainda não tem uma conta?{" "}
            <button
              className="text-lime-500 ml-2"
              onClick={() => {
                onClose();
                openSignUpModal();
              }}
              type="button"
            >
              Criar conta
            </button>
          </p>
        </Modal.Footer>
      </form>
    </Modal>
  );
}
